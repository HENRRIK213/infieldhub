'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filters, setFilters] = useState({ action: '', interface: '', severity: '' });

  const load = async () => {
    const res = await api.get('/logs', { params: filters });
    setLogs(res.data.logs);
  };
  useEffect(() => {
    load();
  }, [filters]);

  const removeLog = async (id: string) => {
    if (!confirm('Delete this log?')) return;
    await api.delete(`/logs/${id}`);
    load();
  };

  return (
    <Layout requireAdmin>
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2B4E] mb-4">Activity Logs</h1>

      <div className="card mb-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
        <input
          className="input flex-1"
          placeholder="Action contains…"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        />
        <select
          className="input"
          value={filters.interface}
          onChange={(e) => setFilters({ ...filters, interface: e.target.value })}
        >
          <option value="">All Interfaces</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="customer">Customer</option>
        </select>
        <select
          className="input"
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
        >
          <option value="">All Severity</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-[#0D2B4E]">
              <th className="py-2">Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Interface</th>
              <th>Details</th>
              <th>Severity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b">
                <td className="py-2">{new Date(l.createdAt).toLocaleString()}</td>
                <td>{l.user?.email || '-'}</td>
                <td className="font-medium">{l.action}</td>
                <td>{l.interface || '-'}</td>
                <td className="text-gray-600">{l.details}</td>
                <td>
                  <span
                    className={
                      l.severity === 'HIGH'
                        ? 'badge-rejected'
                        : l.severity === 'WARN'
                        ? 'badge-pending'
                        : 'badge-info'
                    }
                  >
                    {l.severity}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => removeLog(l.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {logs.map((l) => (
          <div key={l.id} className="card !p-3 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-[#0D2B4E]">{l.action}</div>
                <div className="text-xs text-gray-500">{l.user?.email || '-'}</div>
              </div>
              <span
                className={
                  l.severity === 'HIGH'
                    ? 'badge-rejected'
                    : l.severity === 'WARN'
                    ? 'badge-pending'
                    : 'badge-info'
                }
              >
                {l.severity}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{l.details}</p>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-gray-400">
                {new Date(l.createdAt).toLocaleString()}
              </span>
              <button onClick={() => removeLog(l.id)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}