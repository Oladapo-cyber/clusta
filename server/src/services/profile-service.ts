import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface UserProfileDTO {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  delivery_address: string | null;
  delivery_location: string | null;
  is_legacy_user: boolean;
  is_activated: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileInput {
  full_name?: string | null | undefined;
  phone?: string | null | undefined;
  delivery_address?: string | null | undefined;
  delivery_location?: string | null | undefined;
}

const selectProfileColumns =
  'id,email,full_name,phone,delivery_address,delivery_location,is_legacy_user,is_activated,created_at,updated_at';

const mapProfile = (row: any): UserProfileDTO => ({
  id: row.id,
  email: row.email,
  full_name: row.full_name,
  phone: row.phone,
  delivery_address: row.delivery_address,
  delivery_location: row.delivery_location,
  is_legacy_user: row.is_legacy_user,
  is_activated: row.is_activated,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const ensureUserProfile = async (userId: string, email: string): Promise<UserProfileDTO> => {
  const { data: existingProfile, error: findError } = await supabaseAdmin
    .from('user_profiles')
    .select(selectProfileColumns)
    .eq('id', userId)
    .maybeSingle();

  if (findError) {
    throw new AppError(`Failed to fetch profile: ${findError.message}`, 500, 'PROFILE_FETCH_FAILED');
  }

  if (existingProfile) {
    return mapProfile(existingProfile);
  }

  const { data: createdProfile, error: createError } = await supabaseAdmin
    .from('user_profiles')
    .insert({
      id: userId,
      email,
      is_activated: true,
    })
    .select(selectProfileColumns)
    .single();

  if (createError || !createdProfile) {
    throw new AppError(`Failed to create profile: ${createError?.message ?? 'unknown error'}`, 500, 'PROFILE_CREATE_FAILED');
  }

  return mapProfile(createdProfile);
};

export const updateUserProfile = async (
  userId: string,
  email: string,
  input: UpdateUserProfileInput,
): Promise<UserProfileDTO> => {
  await ensureUserProfile(userId, email);

  const payload: Record<string, string | null> = {};

  if (input.full_name !== undefined) {
    payload.full_name = input.full_name?.trim() || null;
  }

  if (input.phone !== undefined) {
    payload.phone = input.phone?.trim() || null;
  }

  if (input.delivery_address !== undefined) {
    payload.delivery_address = input.delivery_address?.trim() || null;
  }

  if (input.delivery_location !== undefined) {
    payload.delivery_location = input.delivery_location?.trim() || null;
  }

  if (Object.keys(payload).length === 0) {
    return ensureUserProfile(userId, email);
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update(payload)
    .eq('id', userId)
    .select(selectProfileColumns)
    .single();

  if (error || !data) {
    throw new AppError(`Failed to update profile: ${error?.message ?? 'unknown error'}`, 500, 'PROFILE_UPDATE_FAILED');
  }

  return mapProfile(data);
};