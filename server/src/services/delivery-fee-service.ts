import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export type DeliveryLocation = 'Mainland' | 'Island';

const DEFAULT_DELIVERY_FEES_KOBO: Record<DeliveryLocation, number> = {
  Mainland: 300000,
  Island: 200000,
};

export interface DeliveryFeeDTO {
  id: string;
  location: DeliveryLocation;
  fee_kobo: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const mapDeliveryFee = (row: any): DeliveryFeeDTO => ({
  id: row.id,
  location: row.location,
  fee_kobo: row.fee_kobo,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const normalizeDeliveryLocation = (value: string | null | undefined): DeliveryLocation | null => {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'mainland' || normalized === 'lagos mainland') {
    return 'Mainland';
  }

  if (normalized === 'island' || normalized === 'lagos island') {
    return 'Island';
  }

  return null;
};

export const listDeliveryFeesAdmin = async (): Promise<DeliveryFeeDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('delivery_fees')
    .select('id,location,fee_kobo,is_active,created_at,updated_at')
    .order('location', { ascending: true });

  if (error) {
    throw new AppError(`Failed to fetch delivery fees: ${error.message}`, 500, 'DELIVERY_FEES_FETCH_FAILED');
  }

  return (data ?? []).map(mapDeliveryFee);
};

export const listActiveDeliveryFees = async (): Promise<DeliveryFeeDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('delivery_fees')
    .select('id,location,fee_kobo,is_active,created_at,updated_at')
    .eq('is_active', true)
    .order('location', { ascending: true });

  if (error) {
    throw new AppError(`Failed to fetch delivery fees: ${error.message}`, 500, 'DELIVERY_FEES_FETCH_FAILED');
  }

  return (data ?? []).map(mapDeliveryFee);
};

export const updateDeliveryFeeByLocation = async (
  location: DeliveryLocation,
  feeKobo: number,
): Promise<DeliveryFeeDTO> => {
  const { data, error } = await supabaseAdmin
    .from('delivery_fees')
    .upsert(
      {
        location,
        fee_kobo: feeKobo,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'location' },
    )
    .select('id,location,fee_kobo,is_active,created_at,updated_at')
    .single();

  if (error || !data) {
    throw new AppError(`Failed to update delivery fee: ${error?.message ?? 'unknown error'}`, 500, 'DELIVERY_FEE_UPDATE_FAILED');
  }

  return mapDeliveryFee(data);
};

export const resolveDeliveryFeeForLocation = async (
  location: string | null | undefined,
): Promise<{ location: DeliveryLocation; fee_kobo: number }> => {
  const normalizedLocation = normalizeDeliveryLocation(location);

  if (!normalizedLocation) {
    throw new AppError('Delivery location must be Mainland or Island', 400, 'DELIVERY_LOCATION_INVALID');
  }

  const { data, error } = await supabaseAdmin
    .from('delivery_fees')
    .select('location,fee_kobo')
    .eq('location', normalizedLocation)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to resolve delivery fee: ${error.message}`, 500, 'DELIVERY_FEE_RESOLVE_FAILED');
  }

  return {
    location: normalizedLocation,
    fee_kobo: data?.fee_kobo ?? DEFAULT_DELIVERY_FEES_KOBO[normalizedLocation],
  };
};
