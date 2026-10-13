'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/users/customers/list').then((r) => setCustomers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async (id: string, email: string) => {
    if (!confirm(`Remove customer ${email}?`)) return;
    await api.delete(`/users/customers/${id}`);
    load();
  };

  const filtered = customers.filter(
    (c) =>
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout requireAdmin title="Customer Management">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <p className="text-gray-600 text-sm font-semibold">
          {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
        </p>
        <input
          className="input max-w-xs"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0D2B4E] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">First Seen</th>
                <th className="px-4 py-3 text-left font-semibold">Last Seen</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-[#F7FAFF] transition">
                  <td className="px-4 py-3 font-medium text-[#0D2B4E]">{c.email}</td>
                  <td className="px-4 py-3 text-gray-700">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.lastSeenAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(c.id, c.email)} className="btn-danger">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No customers yet. They appear here after verifying via a customer link.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
