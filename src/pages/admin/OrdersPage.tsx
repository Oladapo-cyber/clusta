import { useEffect, useState } from 'react';
import {
  completeAdminOrder,
  fetchAdminOrderById,
  fetchAdminOrders,
  type AdminOrderDetailsDTO,
  type AdminOrderSummaryDTO,
} from '../../services/admin';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

const OrdersPage = () => {
  const [rows, setRows] = useState<AdminOrderSummaryDTO[]>([]);
  const [selected, setSelected] = useState<AdminOrderDetailsDTO | null>(null);
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredRows = rows.filter((row) => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'completed') {
      return row.status === 'completed';
    }
    return row.status !== 'completed';
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[#101828] mb-4">Orders</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 p-3">
            <div className="inline-flex rounded-xl border border-gray-200 bg-[#F9FAFB] p-1">
              {(['active', 'completed', 'all'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                    filter === item ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full min-w-[780px] text-left">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="px-3 py-2 text-sm">Order</th>
                <th className="px-3 py-2 text-sm">Customer</th>
                <th className="px-3 py-2 text-sm">Total</th>
                <th className="px-3 py-2 text-sm">Status</th>
                <th className="px-3 py-2 text-sm">Placed</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-4 text-sm" colSpan={5}>Loading...</td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm" colSpan={5}>No orders found.</td>
                </tr>
              )}
              {!loading &&
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={async () => setSelected(await fetchAdminOrderById(row.id))}
                  >
                    <td className="px-3 py-2 text-xs">{row.id.slice(0, 8)}</td>
                    <td className="px-3 py-2 text-sm">{row.customer_name}</td>
                    <td className="px-3 py-2 text-sm">{naira.format(row.total_kobo / 100)}</td>
                    <td className="px-3 py-2 text-sm">{row.status}</td>
                    <td className="px-3 py-2 text-sm">{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-heading text-lg font-bold text-[#101828] mb-3">Order Details</h2>
          {!selected && <p className="text-sm text-[#4B5563]">Select an order to view full details.</p>}
          {selected && (
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold">Customer:</span> {selected.customer_name}</p>
              <p><span className="font-semibold">Email:</span> {selected.customer_email}</p>
              <p><span className="font-semibold">Phone:</span> {selected.customer_phone}</p>
              <p><span className="font-semibold">Address:</span> {selected.delivery_address}</p>
              <p><span className="font-semibold">Status:</span> {selected.status}</p>
              <p><span className="font-semibold">Payment Ref:</span> {selected.payment_reference ?? '-'}</p>
              {selected.status === 'paid' && (
                <button
                  type="button"
                  disabled={isCompleting}
                  className="rounded-lg bg-[#45AAB8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3d98a5]"
                  onClick={async () => {
                    setIsCompleting(true);
                    setError(null);
                    try {
                      await completeAdminOrder(selected.id);
                      const refreshed = await fetchAdminOrderById(selected.id);
                      setSelected(refreshed);
                      await loadOrders();
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Failed to complete order');
                    } finally {
                      setIsCompleting(false);
                    }
                  }}
                >
                  {isCompleting ? 'Updating...' : 'Mark as Completed'}
                </button>
              )}
              <div>
                <p className="font-semibold mb-2">Items</p>
                <ul className="space-y-2">
                  {selected.items.map((item) => (
                    <li key={item.id} className="rounded-md border border-gray-200 p-2">
                      <p>{item.product_name ?? item.product_id}</p>
                      <p className="text-xs text-[#4B5563]">
                        Qty: {item.quantity} • Unit: {naira.format(item.unit_price_kobo / 100)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;