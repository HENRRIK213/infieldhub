'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/customer-verify-code', { email, code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('loginTime', Date.now().toString());
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ fontSize: 40, marginBottom: 20 }}>✉️</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 10 }}>Check Your Email</h1>
      <p style={{ color: '#64748b', marginBottom: 20, fontSize: 14 }}>Enter the 6-digit code sent to <strong>{email}</strong></p>
      
      {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="text" placeholder="Enter code" maxLength={6} value={code} onChange={e => setCode(e.target.value)} style={{ padding: 14, fontSize: 24, textAlign: 'center', letterSpacing: 10, border: '1px solid #cbd5e1', borderRadius: 8, width: '100%' }} />
        <button type="submit" disabled={loading} style={{ padding: 14, background: loading ? '#94a3b8' : '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Verifying...' : 'Verify & Access Catalog'}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', padding: 20 }}>
      <Suspense fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}