import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface CreateClustaCareResultInput {
  test_result: 'positive' | 'negative' | 'invalid';
  whatsapp_number?: string | null | undefined;
}

export interface ClustaCareResultDTO {
  id: string;
  test_result: 'positive' | 'negative' | 'invalid';
  whatsapp_number: string | null;
  status: 'new' | 'reviewed' | 'follow_up';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const mapResult = (row: any): ClustaCareResultDTO => ({
  id: row.id,
  test_result: row.test_result,
  whatsapp_number: row.whatsapp_number,
  status: row.status,
  admin_notes: row.admin_notes,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const createClustaCareResult = async (
  payload: CreateClustaCareResultInput,
): Promise<ClustaCareResultDTO> => {
  const { data, error } = await supabaseAdmin
    .from('clustacare_results')
    .insert({
      test_result: payload.test_result,
      whatsapp_number: payload.whatsapp_number ?? null,
    })
    .select('id,test_result,whatsapp_number,status,admin_notes,created_at,updated_at')
    .single();

  if (error || !data) {
    throw new AppError(`Failed to save result: ${error?.message ?? 'unknown error'}`, 500, 'RESULT_CREATE_FAILED');
  }

  return mapResult(data);
};

export const listClustaCareResults = async (): Promise<ClustaCareResultDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('clustacare_results')
    .select('id,test_result,whatsapp_number,status,admin_notes,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch results: ${error.message}`, 500, 'RESULT_FETCH_FAILED');
  }

  return (data ?? []).map(mapResult);
};

export const updateClustaCareResult = async (
  id: string,
  payload: {
    status?: 'new' | 'reviewed' | 'follow_up' | undefined;
    admin_notes?: string | null | undefined;
  },
): Promise<ClustaCareResultDTO> => {
  const { data, error } = await supabaseAdmin
    .from('clustacare_results')
    .update({
      status: payload.status,
      admin_notes: payload.admin_notes,
    })
    .eq('id', id)
    .select('id,test_result,whatsapp_number,status,admin_notes,created_at,updated_at')
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to update result: ${error.message}`, 500, 'RESULT_UPDATE_FAILED');
  }

  if (!data) {
    throw new AppError('Result not found', 404, 'RESULT_NOT_FOUND');
  }

  return mapResult(data);
};