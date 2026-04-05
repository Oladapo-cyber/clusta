import { useEffect, useState } from 'react';
import { fetchAdminResults, updateAdminResult, type ClustaCareResultDTO } from '../../services/admin';

const ResultsPage = () => {
  const [rows, setRows] = useState<ClustaCareResultDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAdminResults());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[#101828] mb-4">Results</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left min-w-[720px]">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-3 py-2 text-sm">Submitted</th>
              <th className="px-3 py-2 text-sm">Result</th>
              <th className="px-3 py-2 text-sm">WhatsApp</th>
              <th className="px-3 py-2 text-sm">Status</th>
              <th className="px-3 py-2 text-sm">Admin Note</th>
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
                <td className="px-3 py-4 text-sm" colSpan={6}>No results found.</td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 text-sm capitalize">{row.test_result}</td>
                  <td className="px-3 py-2 text-sm">{row.whatsapp_number ?? '-'}</td>
                  <td className="px-3 py-2 text-sm">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={row.status}
                      onChange={async (event) => {
                        await updateAdminResult(row.id, { status: event.target.value as ClustaCareResultDTO['status'] });
                        await load();
                      }}
                    >
                      <option value="new">new</option>
                      <option value="reviewed">reviewed</option>
                      <option value="follow_up">follow_up</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-sm max-w-[260px] truncate">{row.admin_notes ?? '-'}</td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      className="rounded border border-gray-300 px-2 py-1"
                      onClick={async () => {
                        const note = prompt('Admin note', row.admin_notes ?? '') ?? row.admin_notes ?? null;
                        await updateAdminResult(row.id, { admin_notes: note });
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

export default ResultsPage;