import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Archive, Box, PlusCircle, Search, Sparkles } from 'lucide-react';
import { fetchAdminOrders, type AdminOrderSummaryDTO } from '../services/admin';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchCategories,
  fetchAdminProducts,
  type CategoryDTO,
  type ProductDTO,
  updateAdminProduct,
} from '../services/products';

const ENV_ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY;

interface AdminProductsProps {
  embedded?: boolean;
}

interface ProductFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  full_description: string;
  image_url: string;
  price_kobo: string;
  category_id: string;
  is_active: boolean;
}

const defaultFormState: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  full_description: '',
  image_url: '',
  price_kobo: '',
  category_id: '',
  is_active: true,
};

const requestArchiveConfirmation = (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      () => (
        <div className="w-[340px] rounded-lg border border-amber-300 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-[#111827]">Archive {name}?</p>
          <p className="mt-1 text-xs text-[#4B5563]">This product will be hidden from shoppers.</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Archive
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  });
};

const requestRestoreConfirmation = (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      () => (
        <div className="w-[340px] rounded-lg border border-emerald-300 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-[#111827]">Restore {name}?</p>
          <p className="mt-1 text-xs text-[#4B5563]">This product will become visible to shoppers again.</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Restore
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  });
};

const AdminProducts = ({ embedded = false }: AdminProductsProps) => {
  const [isAuthorized, setIsAuthorized] = useState(
    embedded ? true : Boolean(localStorage.getItem('admin_api_key') || ENV_ADMIN_KEY),
  );
  const [adminKeyInput, setAdminKeyInput] = useState('');

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(defaultFormState);
  const [orders, setOrders] = useState<AdminOrderSummaryDTO[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'archived'>('all');

  const isEditing = Boolean(form.id);

  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      void loadProducts();
      void fetchCategories().then(setCategories).catch(() => undefined);
      void fetchAdminOrders().then(setOrders).catch(() => undefined);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (embedded) {
      setIsAuthorized(true);
    }
  }, [embedded]);

  const formatNaira = (priceKobo: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(priceKobo / 100);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.slug.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        activeFilter === 'all' ||
        (activeFilter === 'active' && product.is_active) ||
        (activeFilter === 'archived' && !product.is_active);

      return matchesQuery && matchesStatus;
    });
  }, [products, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const active = products.filter((product) => product.is_active).length;
    const archived = products.length - active;
    return {
      total: products.length,
      active,
      archived,
      categories: categories.length,
    };
  }, [products, categories]);

  const salesByDay = useMemo(() => {
    const labels = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      const key = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('en-NG', { weekday: 'short' });
      return { key, label, total_kobo: 0 };
    });

    const dayMap = new Map(labels.map((item) => [item.key, item]));

    orders.forEach((order) => {
      if (!(order.status === 'paid' || order.status === 'completed')) {
        return;
      }

      const key = new Date(order.created_at).toISOString().slice(0, 10);
      const day = dayMap.get(key);
      if (day) {
        day.total_kobo += order.total_kobo;
      }
    });

    return labels;
  }, [orders]);

  const maxSalesKobo = useMemo(() => {
    return Math.max(...salesByDay.map((item) => item.total_kobo), 1);
  }, [salesByDay]);

  const startEdit = (product: ProductDTO) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      full_description: product.full_description ?? '',
      image_url: product.image_url ?? '',
      price_kobo: String(product.price_kobo),
      category_id: product.category_id ?? '',
      is_active: product.is_active,
    });
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setErrorMessage(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedPrice = Number(form.price_kobo);
    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Price must be a whole number in kobo. Example: 17000');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      full_description: form.full_description.trim() || null,
      image_url: form.image_url.trim() || null,
      price_kobo: parsedPrice,
      category_id: form.category_id.trim() || null,
      is_active: form.is_active,
    };

    try {
      if (form.id) {
        await updateAdminProduct(form.id, payload);
        toast.success('Product updated');
      } else {
        await createAdminProduct(payload);
        toast.success('Product created');
      }

      await loadProducts();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: ProductDTO) => {
    const shouldDelete = await requestArchiveConfirmation(product.name);
    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await deleteAdminProduct(product.id);
      await loadProducts();
      if (form.id === product.id) {
        resetForm();
      }
      toast.success('Product archived');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to archive product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (product: ProductDTO) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await updateAdminProduct(product.id, { is_active: !product.is_active });
      await loadProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const authorize = () => {
    if (!adminKeyInput.trim()) {
      setErrorMessage('Enter the admin API key to continue.');
      return;
    }

    localStorage.setItem('admin_api_key', adminKeyInput.trim());
    setIsAuthorized(true);
    setErrorMessage(null);
  };

  if (!embedded && !isAuthorized) {
    return (
      <div className="py-6 px-2">
        <div className="max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="font-heading text-3xl font-bold text-[#101828] mb-3">Admin Access</h1>
          <p className="font-body text-[#575151] mb-6">Enter your admin API key to manage products.</p>
          <input
            type="password"
            value={adminKeyInput}
            onChange={(event) => setAdminKeyInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 mb-4"
            placeholder="Admin API key"
          />
          {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
          <button
            onClick={authorize}
            className="w-full rounded-lg bg-[#45AAB8] text-white py-3 font-semibold hover:bg-[#3d98a5]"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!embedded && !localStorage.getItem('admin_api_key') && !ENV_ADMIN_KEY) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#101828]">Products</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Manage product availability, pricing, and catalog content.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or slug"
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#45AAB8]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">Total</p>
          <p className="mt-1 text-2xl font-bold text-[#101828]">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">Active</p>
          <p className="mt-1 text-2xl font-bold text-[#0F766E]">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">Archived</p>
          <p className="mt-1 text-2xl font-bold text-[#9CA3AF]">{stats.archived}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">Categories</p>
          <p className="mt-1 text-2xl font-bold text-[#101828]">{stats.categories}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#BFE9E3] bg-white p-4 shadow-sm md:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-[#0F766E]" />
          <p className="text-sm font-semibold text-[#0F766E]">7-Day Sales (Paid + Completed)</p>
        </div>
        <div className="grid grid-cols-[40px_1fr] gap-3">
          <div className="flex flex-col justify-between text-[10px] text-[#6B7280] py-1">
            <span>{formatNaira(maxSalesKobo / 100)}</span>
            <span>{formatNaira(maxSalesKobo / 200)}</span>
            <span>{formatNaira(0)}</span>
          </div>
          <div className="h-28 rounded-lg bg-gradient-to-r from-[#E8F7F4] to-[#F3F4F6] px-2 pt-2 pb-1">
            <div className="flex h-full items-end justify-between gap-2">
              {salesByDay.map((item) => {
                const heightPct = Math.max((item.total_kobo / maxSalesKobo) * 100, item.total_kobo > 0 ? 8 : 3);
                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div className="w-full rounded-t bg-[#45AAB8]" style={{ height: `${heightPct}%` }} />
                    <span className="text-[10px] text-[#4B5563]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.9fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-xl font-bold text-[#101828]">Catalog Table</h2>
            <div className="inline-flex rounded-xl border border-gray-200 bg-[#F9FAFB] p-1">
              {(['all', 'active', 'archived'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                    activeFilter === filter ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Slug</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Category</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-t border-gray-100">
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!isLoading && filteredProducts.length === 0 && (
                  <tr>
                    <td className="px-4 py-16" colSpan={6}>
                      <div className="flex flex-col items-center justify-center text-center">
                        <Box size={28} className="text-[#9CA3AF]" />
                        <p className="mt-3 text-sm font-semibold text-[#374151]">No products match this view</p>
                        <p className="mt-1 text-xs text-[#6B7280]">Try changing search or status filters.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-100 align-top hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3 text-sm font-medium text-[#101828]">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{product.slug}</td>
                      <td className="px-4 py-3 text-sm text-[#374151]">{formatNaira(product.price_kobo)}</td>
                      <td className="px-4 py-3 text-sm text-[#374151]">{product.category_name ?? 'No category'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="rounded-md border border-[#CFEDEA] bg-[#E8F7F4] px-3 py-1.5 text-xs font-medium text-[#0F766E]"
                          >
                            Edit
                          </button>
                          {product.is_active ? (
                            <button
                              type="button"
                              onClick={() => void handleDelete(product)}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"
                            >
                              <Archive size={12} />
                              Archive
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={async () => {
                                const shouldRestore = await requestRestoreConfirmation(product.name);
                                if (!shouldRestore) {
                                  return;
                                }
                                await handleToggleActive(product);
                              }}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PlusCircle size={18} className="text-[#45AAB8]" />
            <h2 className="font-heading text-xl font-bold text-[#101828]">
              {isEditing ? 'Edit Product' : 'Create Product'}
            </h2>
          </div>

          <form className="space-y-3" onSubmit={(event) => void handleSave(event)}>
            <input
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Slug (optional)"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Price in kobo (e.g. 17000)"
              value={form.price_kobo}
              onChange={(event) => setForm((prev) => ({ ...prev, price_kobo: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Image URL"
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            />
            <textarea
              className="min-h-20 w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Card description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              placeholder="Full product description"
              value={form.full_description}
              onChange={(event) => setForm((prev) => ({ ...prev, full_description: event.target.value }))}
            />
            <select
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#45AAB8]"
              value={form.category_id}
              onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-2 text-sm text-[#374151]">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                className="accent-[#45AAB8]"
              />
              Product is active
            </label>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#45AAB8] py-2.5 text-sm font-semibold text-white hover:bg-[#3d98a5]"
                disabled={isSubmitting}
              >
                {isEditing ? 'Save Changes' : 'Create Product'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#374151]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminProducts;
