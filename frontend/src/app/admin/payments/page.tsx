'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  const load = () => api.get('/payments').then((r) => setPayments(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    await api.put(`/payments/${id}/approve`);
    load();
  };

  return (
    <Layout requireAdmin theme="cream" title="Payments">
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0D2B4E] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-[#F7FAFF] transition">
                  <td className="px-4 py-3 font-mono text-xs text-[#0D2B4E]">{p.reference}</td>
                  <td className="px-4 py-3 text-gray-700">{p.customerPhone}</td>
                  <td className="px-4 py-3 font-bold text-[#1E88E5]">KES {Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status !== 'APPROVED' && (
                      <button onClick={() => approve(p.id)} className="btn-success">Approve</button>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}