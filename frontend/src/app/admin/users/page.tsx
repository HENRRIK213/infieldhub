'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'EMPLOYEE',
    phone: '',
  });
  const [error, setError] = useState('');

  const load = () => api.get('/users').then((r) => setUsers(r.data));
  useEffect(() => {
    load();
  }, []);

  const addUser = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setShowAdd(false);
      setForm({ email: '', password: '', name: '', role: 'EMPLOYEE', phone: '' });
      load();
    } catch (err: any) {
      setError(
        err.response?.data?.details?.join(', ') ||
          err.response?.data?.error ||
          'Failed'
      );
    }
  };
  const remove = async (id: string) => {
    if (confirm('Delete user?')) {
      await api.delete(`/users/${id}`);
      load();
    }
  };
  const forceLogout = async (id: string) => {
    await api.post(`/users/${id}/force-logout`);
    alert('Forced logout');
  };

  return (
    <Layout requireAdmin>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#0D2B4E]">Users</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add User
        </button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Active</th>
              <th>Last Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.active ? '✅' : '❌'}</td>
                <td>
                  {u.lastLogin
                    ? new Date(u.lastLogin).toLocaleString()
                    : '-'}
                </td>
                <td className="space-x-2">
                  <button
                    className="btn-navy text-xs"
                    onClick={() => forceLogout(u.id)}
                  >
                    Force Logout
                  </button>
                  {u.role !== 'ADMIN' && (
                    <button
                      className="btn-danger text-xs"
                      onClick={() => remove(u.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#0D2B4E] mb-4">Add User</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <form onSubmit={addUser} className="space-y-3">
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
                <label className="label">Name</label>
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
                <label className="label">
                  Password (12+ chars, upper, lower, number, special)
                </label>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-navy"
                  onClick={() => setShowAdd(false)}
                >
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