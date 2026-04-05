import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface CreateContactInquiryInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactInquiryDTO {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'spam';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const mapInquiry = (row: any): ContactInquiryDTO => ({
  id: row.id,
  name: row.name,
  email: row.email,
  message: row.message,
  status: row.status,
  admin_notes: row.admin_notes,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const createContactInquiry = async (
  payload: CreateContactInquiryInput,
): Promise<ContactInquiryDTO> => {
  const { data, error } = await supabaseAdmin
    .from('contact_inquiries')
    .insert(payload)
    .select('id,name,email,message,status,admin_notes,created_at,updated_at')
    .single();

  if (error || !data) {
    throw new AppError(
      `Failed to submit contact inquiry: ${error?.message ?? 'unknown error'}`,
      500,
      'CONTACT_CREATE_FAILED',
    );
  }

  return mapInquiry(data);
};

export const listContactInquiries = async (): Promise<ContactInquiryDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('contact_inquiries')
    .select('id,name,email,message,status,admin_notes,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch contact inquiries: ${error.message}`, 500, 'CONTACT_FETCH_FAILED');
  }

  return (data ?? []).map(mapInquiry);
};

export const updateContactInquiry = async (
  id: string,
  payload: {
    status?: 'new' | 'in_progress' | 'resolved' | 'spam' | undefined;
    admin_notes?: string | null | undefined;
  },
): Promise<ContactInquiryDTO> => {
  const { data, error } = await supabaseAdmin
    .from('contact_inquiries')
    .update({
      status: payload.status,
      admin_notes: payload.admin_notes,
    })
    .eq('id', id)
    .select('id,name,email,message,status,admin_notes,created_at,updated_at')
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to update inquiry: ${error.message}`, 500, 'CONTACT_UPDATE_FAILED');
  }

  if (!data) {
    throw new AppError('Inquiry not found', 404, 'CONTACT_NOT_FOUND');
  }

  return mapInquiry(data);
};