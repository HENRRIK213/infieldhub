'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  }, []);

  const changePassword = async (e: any) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (newPassword !== confirmPassword) return setError('New passwords do not match.');
    setLoading(true);
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setMessage('✅ Password updated successfully!');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.details?.join(', ') || err.response?.data?.error || 'Failed.');
    } finally { setLoading(false); }
  };

  return (
    <Layout requireAdmin theme="cream" title="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E88E5] to-[#4FC3F7] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0D2B4E]">{user?.name || 'Administrator'}</div>
              <div className="text-[#1E88E5] text-sm">{user?.email}</div>
              <div className="inline-block mt-2 bg-[#0D2B4E] text-[#4FC3F7] text-xs font-bold px-3 py-1 rounded-full">
                SUPER ADMIN
              </div>
            </div>
          </div>
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Type</span>
              <span className="text-[#0D2B4E] font-semibold">Administrator</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-semibold">● Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User ID</span>
              <span className="text-[#0D2B4E] font-mono text-xs">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="text-xl font-bold text-[#0D2B4E] mb-4">🔐 Change Password</h2>
          {message && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={changePassword} className="space-y-4">
            <div><label className="label">Current Password</label><input className="input" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>
            <div>
              <label className="label">New Password</label>
              <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <p className="text-xs text-gray-500 mt-1">12+ chars, uppercase, lowercase, number, special character.</p>
            </div>
            <div><label className="label">Confirm New Password</label><input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
            <button disabled={loading} className="btn-primary w-full">{loading ? 'Updating…' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}