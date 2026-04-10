import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';
import { ensureUserProfile, updateUserProfile } from './profile-service.js';

export interface CreateOrderInput {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  user_id?: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface CreateAuthenticatedOrderInput {
  customer_name?: string | undefined;
  customer_phone?: string | undefined;
  delivery_address?: string | undefined;
  delivery_location?: string | undefined;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface CreateOrderResult {
  id: string;
  total_kobo: number;
  status: string;
  payment_reference: string;
}

export interface AdminOrderSummaryDTO {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_kobo: number;
  status: string;
  payment_reference: string | null;
  created_at: string;
}

export interface AdminOrderDetailsDTO extends AdminOrderSummaryDTO {
  items: Array<{
    id: string;
    product_id: string;
    product_name: string | null;
    quantity: number;
    unit_price_kobo: number;
  }>;
}

const generateReference = (): string => `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const createOrder = async (payload: CreateOrderInput): Promise<CreateOrderResult> => {
  if (payload.items.length === 0) {
    throw new AppError('Order must include at least one item', 400, 'EMPTY_ORDER');
  }

  const productIds = payload.items.map((item) => item.product_id);

  const { data: products, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, price_kobo')
    .in('id', productIds);

  if (productError) {
    throw new AppError(`Failed to validate products: ${productError.message}`, 500, 'PRODUCT_VALIDATION_FAILED');
  }

  const priceMap = new Map<string, number>((products ?? []).map((product: any) => [product.id, product.price_kobo]));

  let total_kobo = 0;
  const orderItems = payload.items.map((item) => {
    const unitPrice = priceMap.get(item.product_id);
    if (unitPrice === undefined) {
      throw new AppError(`Invalid product id: ${item.product_id}`, 400, 'INVALID_PRODUCT');
    }
    total_kobo += unitPrice * item.quantity;
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_kobo: unitPrice,
    };
  });

  const payment_reference = generateReference();

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: payload.user_id ?? null,
      customer_email: payload.customer_email,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      delivery_address: payload.delivery_address,
      total_kobo,
      status: 'pending_payment',
      payment_reference,
    })
    .select('id,total_kobo,status,payment_reference')
    .single();

  if (orderError || !order) {
    throw new AppError(`Failed to create order: ${orderError?.message ?? 'unknown error'}`, 500, 'ORDER_CREATE_FAILED');
  }

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
    orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  if (itemsError) {
    throw new AppError(`Failed to save order items: ${itemsError.message}`, 500, 'ORDER_ITEMS_CREATE_FAILED');
  }

  return {
    id: order.id,
    total_kobo: order.total_kobo,
    status: order.status,
    payment_reference: order.payment_reference,
  };
};

export const createOrderForAuthenticatedUser = async (
  userId: string,
  email: string,
  payload: CreateAuthenticatedOrderInput,
): Promise<CreateOrderResult> => {
  const profile = await ensureUserProfile(userId, email);

  const nextName = payload.customer_name?.trim() || profile.full_name || 'Customer';
  const nextPhone = payload.customer_phone?.trim() || profile.phone || '';
  const nextDeliveryAddress = payload.delivery_address?.trim() || profile.delivery_address || '';
  const nextDeliveryLocation = payload.delivery_location?.trim() || profile.delivery_location || '';

  if (!nextPhone) {
    throw new AppError('Phone number is required for checkout', 400, 'PHONE_REQUIRED');
  }

  if (!nextDeliveryAddress) {
    throw new AppError('Delivery address is required for checkout', 400, 'DELIVERY_ADDRESS_REQUIRED');
  }

  const formattedAddress = nextDeliveryLocation
    ? `${nextDeliveryAddress}, Lagos ${nextDeliveryLocation}`
    : nextDeliveryAddress;

  await updateUserProfile(userId, email, {
    full_name: nextName,
    phone: nextPhone,
    delivery_address: nextDeliveryAddress,
    delivery_location: nextDeliveryLocation || null,
  });

  return createOrder({
    user_id: userId,
    customer_email: email,
    customer_name: nextName,
    customer_phone: nextPhone,
    delivery_address: formattedAddress,
    items: payload.items,
  });
};

export const markOrderPaid = async (payment_reference: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'paid' })
    .eq('payment_reference', payment_reference)
    .eq('status', 'pending_payment');

  if (error) {
    throw new AppError(`Failed to update order status: ${error.message}`, 500, 'ORDER_STATUS_UPDATE_FAILED');
  }
};

export const markOrderCompleted = async (id: string): Promise<AdminOrderSummaryDTO> => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', id)
    .eq('status', 'paid')
    .select('id,customer_email,customer_name,customer_phone,delivery_address,total_kobo,status,payment_reference,created_at')
    .maybeSingle();

  if (error) {
    throw new AppError(`Failed to complete order: ${error.message}`, 500, 'ORDER_COMPLETE_FAILED');
  }

  if (!data) {
    throw new AppError('Only paid orders can be marked as completed', 400, 'ORDER_NOT_ELIGIBLE_FOR_COMPLETION');
  }

  return data as AdminOrderSummaryDTO;
};

export const listOrdersAdmin = async (): Promise<AdminOrderSummaryDTO[]> => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id,customer_email,customer_name,customer_phone,delivery_address,total_kobo,status,payment_reference,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Failed to fetch orders: ${error.message}`, 500, 'ORDER_FETCH_FAILED');
  }

  return (data ?? []) as AdminOrderSummaryDTO[];
};

export const getOrderByIdAdmin = async (id: string): Promise<AdminOrderDetailsDTO> => {
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('id,customer_email,customer_name,customer_phone,delivery_address,total_kobo,status,payment_reference,created_at')
    .eq('id', id)
    .maybeSingle();

  if (orderError) {
    throw new AppError(`Failed to fetch order: ${orderError.message}`, 500, 'ORDER_FETCH_FAILED');
  }

  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('id,product_id,quantity,unit_price_kobo,products(name)')
    .eq('order_id', id)
    .order('created_at', { ascending: true });

  if (itemsError) {
    throw new AppError(`Failed to fetch order items: ${itemsError.message}`, 500, 'ORDER_ITEMS_FETCH_FAILED');
  }

  return {
    ...(order as AdminOrderSummaryDTO),
    items: (items ?? []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.products?.name ?? null,
      quantity: item.quantity,
      unit_price_kobo: item.unit_price_kobo,
    })),
  };
};
