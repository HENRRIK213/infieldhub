'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [inviteLink, setInviteLink] = useState<any>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = () =>
    api.get('/users/employees').then((r) => setEmployees(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const addEmployee = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', { ...form, role: 'EMPLOYEE' });
      setShowAdd(false);
      setForm({ email: '', password: '', name: '', phone: '' });
      load();
    } catch (err: any) {
      setError(err.response?.data?.details?.join(', ') || err.response?.data?.error || 'Failed');
    }
  };

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/invites/employee/generate');
      setInviteLink(res.data);
      setCopied(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const copyInvite = () => {
    if (!inviteLink?.url) return;
    navigator.clipboard.writeText(inviteLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!inviteLink?.url) return;
    window.open(
      `https://wa.me/?text=You are invited to join InfieldHub. Register here: ${inviteLink.url}`,
      '_blank'
    );
  };

  const shareEmail = () => {
    if (!inviteLink?.url) return;
    window.location.href = `mailto:?subject=InfieldHub Employee Invitation&body=You are invited to register as an InfieldHub employee. Click here to register: ${inviteLink.url}`;
  };

  const remove = async (id: string, email: string) => {
    if (!confirm(`Remove employee ${email}?`)) return;
    await api.delete(`/users/${id}`);
    load();
  };

  const forceLogout = async (id: string) => {
    await api.post(`/users/${id}/force-logout`);
    alert('Employee session ended.');
  };

  const toggle = async (id: string) => {
    await api.put(`/users/${id}/toggle`);
    load();
  };

  return (
    <Layout
      requireAdmin
      title="Employee Management"
      subtitle="Invite new employees or manage existing staff."
    >
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button onClick={generateInvite} disabled={generating} className="btn-teal">
          {generating ? 'Generating…' : '🔗 Generate Registration Link'}
        </button>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add Employee Directly
        </button>
      </div>

      {/* Invite link display */}
      {inviteLink && (
        <div className="card mb-6 border-2 border-[#4FC3F7] bg-[#E1F5FE]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-[#0D2B4E]">📋 Employee Registration Link</h2>
            <button
              onClick={() => setInviteLink(null)}
              className="text-gray-500 text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#0D2B4E] mb-3">
            Share this link with the new employee. It expires in 7 days.
            When they open it, they will register and receive a verification code on their email.
          </p>
          <div className="bg-white border border-[#4FC3F7] rounded-lg p-3 text-xs break-all font-mono text-[#0D2B4E] mb-3">
            {inviteLink.url}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={copyInvite} className="btn-primary justify-center text-sm">
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button onClick={shareWhatsApp} className="btn-success justify-center">
              💬 WhatsApp
            </button>
            <button onClick={shareEmail} className="btn-teal justify-center text-sm">
              ✉️ Email
            </button>
          </div>
        </div>
      )}

      {/* Employee table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0D2B4E] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-[#F7FAFF]">
                  <td className="px-4 py-3 font-medium text-[#0D2B4E]">{u.email}</td>
                  <td className="px-4 py-3 text-gray-700">{u.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={u.active ? 'badge-approved' : 'badge-rejected'}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => forceLogout(u.id)}
                      className="btn-navy !px-2.5 !py-1.5 !text-xs"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => toggle(u.id)}
                      className="bg-[#F9A825] hover:bg-yellow-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold"
                    >
                      {u.active ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => remove(u.id, u.email)} className="btn-danger">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No employees yet. Generate an invite link or add one directly.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#0D2B4E] mb-4">Add Employee Directly</h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-3">{error}</div>
            )}
            <form onSubmit={addEmployee} className="space-y-3">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-navy" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}