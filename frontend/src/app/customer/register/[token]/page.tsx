'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function CustomerRegister() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [linkChecking, setLinkChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsExpired(true);
      setLinkChecking(false);
      return;
    }

    api.get(`/customers/link/${encodeURIComponent(token)}`)
      .then((response) => {
        if (!response.data.valid) setIsExpired(true);
      })
      .catch((err) => {
        if (err.response?.status === 404 || err.response?.status === 410) {
          setIsExpired(true);
          return;
        }
        setError(err.response?.data?.error || 'Unable to verify this invitation link. Please try again.');
      })
      .finally(() => {
        setLinkChecking(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/customer-request-code', { email, token });
      router.push(`/customer/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isExpired) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', padding: 20 }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 16, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 50, color: '#EF4444', marginBottom: 20 }}>🔒</div>
          <p style={{ color: '#64748b' }}>Link Invalid or Expired. Please contact your administrator to request a new link.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', padding: 20 }}>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Join InfieldHub</h1>
      
      <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E', marginBottom: 16 }}>Enter your email</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>We'll send a 6-digit code to confirm it's you.</p>
        
        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#0D2B4E', display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" style={{ width: '100%', padding: 14, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading || linkChecking} style={{ padding: 14, background: loading || linkChecking ? '#94a3b8' : '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: loading || linkChecking ? 'not-allowed' : 'pointer', marginTop: 10 }}>
            {linkChecking ? 'Checking Link...' : loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      </div>
    </div>
  );
}