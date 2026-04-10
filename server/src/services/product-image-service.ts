import path from 'node:path';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

const STORAGE_BUCKET = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const STORAGE_PUBLIC_SEGMENT = '/storage/v1/object/public/';

const extensionByMimeType: Record<string, string> = {
  'image/avif': 'avif',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

let bucketChecked = false;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const ensureBucket = async (): Promise<void> => {
  if (bucketChecked) {
    return;
  }

  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    throw new AppError(`Unable to list storage buckets: ${listError.message}`, 500, 'STORAGE_LIST_FAILED');
  }

  const bucketExists = buckets.some((bucket) => bucket.name === STORAGE_BUCKET);

  if (!bucketExists) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
    });

    if (createError) {
      throw new AppError(`Unable to create storage bucket: ${createError.message}`, 500, 'STORAGE_BUCKET_CREATE_FAILED');
    }
  }

  bucketChecked = true;
};

const getExtension = (fileName: string, mimeType: string): string => {
  const byMime = extensionByMimeType[mimeType];
  if (byMime) {
    return byMime;
  }

  const fileExt = path.extname(fileName).replace('.', '').toLowerCase();
  if (fileExt) {
    return fileExt;
  }

  throw new AppError('Unsupported image type. Use avif, jpeg, png, or webp.', 400, 'IMAGE_TYPE_UNSUPPORTED');
};

export interface ProductImageUploadResult {
  bucket: string;
  path: string;
  url: string;
}

const parseStorageObjectFromPublicUrl = (imageUrl: string): { bucket: string; path: string } | null => {
  try {
    const parsedUrl = new URL(imageUrl);
    const markerIndex = parsedUrl.pathname.indexOf(STORAGE_PUBLIC_SEGMENT);
    if (markerIndex === -1) {
      return null;
    }

    const storagePath = parsedUrl.pathname.slice(markerIndex + STORAGE_PUBLIC_SEGMENT.length);
    const firstSlash = storagePath.indexOf('/');
    if (firstSlash <= 0 || firstSlash === storagePath.length - 1) {
      return null;
    }

    const bucket = storagePath.slice(0, firstSlash);
    const objectPath = storagePath.slice(firstSlash + 1);
    if (!bucket || !objectPath) {
      return null;
    }

    return { bucket, path: decodeURIComponent(objectPath) };
  } catch {
    return null;
  }
};

export const deleteProductImageByPublicUrl = async (imageUrl: string): Promise<boolean> => {
  const storageObject = parseStorageObjectFromPublicUrl(imageUrl);
  if (!storageObject || storageObject.bucket !== STORAGE_BUCKET) {
    return false;
  }

  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([storageObject.path]);
  if (error) {
    throw new AppError(`Failed to delete previous image: ${error.message}`, 500, 'IMAGE_DELETE_FAILED');
  }

  return true;
};

export const uploadProductImage = async (
  file: Express.Multer.File,
  slugHint?: string,
): Promise<ProductImageUploadResult> => {
  if (!file) {
    throw new AppError('Image file is required', 400, 'IMAGE_FILE_REQUIRED');
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are allowed', 400, 'IMAGE_TYPE_INVALID');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError('Image must be 5MB or smaller', 413, 'IMAGE_TOO_LARGE');
  }

  await ensureBucket();

  const baseName = slugify(slugHint || file.originalname || 'product-image') || 'product-image';
  const extension = getExtension(file.originalname, file.mimetype);
  const objectPath = `${baseName}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, file.buffer, {
      upsert: false,
      contentType: file.mimetype,
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new AppError(`Failed to upload image: ${uploadError.message}`, 500, 'IMAGE_UPLOAD_FAILED');
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);

  return {
    bucket: STORAGE_BUCKET,
    path: objectPath,
    url: data.publicUrl,
  };
};