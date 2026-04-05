import { useEffect, useState } from 'react';
import {
  fetchAdminContactInquiries,
  updateAdminContactInquiry,
  type ContactInquiryDTO,
} from '../../services/admin';

const ContactPage = () => {
  const [rows, setRows] = useState<ContactInquiryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAdminContactInquiries());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load contact inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[#101828] mb-4">Contact</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left min-w-[840px]">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-3 py-2 text-sm">Submitted</th>
              <th className="px-3 py-2 text-sm">Name</th>
              <th className="px-3 py-2 text-sm">Email</th>
              <th className="px-3 py-2 text-sm">Message</th>
              <th className="px-3 py-2 text-sm">Status</th>
              <th className="px-3 py-2 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-3 py-4 text-sm" colSpan={6}>Loading...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-sm" colSpan={6}>No inquiries found.</td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 align-top">
                  <td className="px-3 py-2 text-sm">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm">{row.name}</td>
                  <td className="px-3 py-2 text-sm">{row.email}</td>
                  <td className="px-3 py-2 text-sm max-w-[280px] whitespace-pre-wrap">{row.message}</td>
                  <td className="px-3 py-2 text-sm">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={row.status}
                      onChange={async (event) => {
                        await updateAdminContactInquiry(row.id, {
                          status: event.target.value as ContactInquiryDTO['status'],
                        });
                        await load();
                      }}
                    >
                      <option value="new">new</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                      <option value="spam">spam</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      className="rounded border border-gray-300 px-2 py-1"
                      onClick={async () => {
                        const note = prompt('Admin note', row.admin_notes ?? '') ?? row.admin_notes ?? null;
                        await updateAdminContactInquiry(row.id, { admin_notes: note });
                        await load();
                      }}
                    >
                      Note
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactPage;