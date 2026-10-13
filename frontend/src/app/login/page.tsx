'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needs2FA, setNeeds2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      if (user.role === 'ADMIN') router.replace('/admin');
      else if (user.role === 'EMPLOYEE') router.replace('/employee');
    }
  }, [router]);

  const redirectByRole = (role: string) => {
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'EMPLOYEE') router.push('/employee');
    else router.push('/products');
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.requires2FA) setNeeds2FA(true);
      else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        redirectByRole(res.data.user.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-2fa', { email, code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      redirectByRole(res.data.user.role);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D2B4E 0%, #1565C0 55%, #1E88E5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Centered Card Container */}
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* ============================================================
            LOGO AT TOP — 60px (25% of previous size)
            ============================================================ */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 12px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src="/logo.png"
              alt="Infield"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML =
                    '<span style="color:#0D2B4E;font-size:22px;font-weight:900">iF</span>';
                }
              }}
            />
          </div>

          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            InfieldHub
          </h1>

          <p
            style={{
              color: '#4FC3F7',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              marginTop: '6px',
              margin: 0,
            }}
          >
            SOLAR • ELECTRICAL • WATER
          </p>
        </div>

        {/* ============================================================
            LOGIN FORM CARD — centered
            ============================================================ */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '32px 28px',
            boxShadow: '0 20px 50px rgba(13, 43, 78, 0.35)',
          }}
        >
          {!needs2FA ? (
            <>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0D2B4E',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  textAlign: 'center',
                  marginTop: '4px',
                  marginBottom: '24px',
                }}
              >
                Sign in to your account
              </p>

              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    marginBottom: '18px',
                    fontSize: '13px',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0D2B4E',
                      marginBottom: '6px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@infieldhub.com"
                    required
                    autoComplete="email"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#0D2B4E',
                      background: '#F8FAFC',
                      outline: 'none',
                      transition: 'border 0.15s, box-shadow 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1E88E5';
                      e.target.style.background = '#FFFFFF';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30,136,229,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.background = '#F8FAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0D2B4E',
                      marginBottom: '6px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#0D2B4E',
                      background: '#F8FAFC',
                      outline: 'none',
                      transition: 'border 0.15s, box-shadow 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1E88E5';
                      e.target.style.background = '#FFFFFF';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30,136,229,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.background = '#F8FAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: loading ? '#94a3b8' : '#0D2B4E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.02em',
                    transition: 'background 0.15s',
                    marginTop: '4px',
                    fontFamily: 'inherit',
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.background = '#08203a';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.background = '#0D2B4E';
                  }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              {/* Demo credentials */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    textAlign: 'center',
                    marginBottom: '10px',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                  }}
                >
                  DEMO CREDENTIALS
                </p>
                <div
                  style={{
                    background: '#F0F7FF',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    color: '#0D2B4E',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>Admin:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      admin@infieldhub.com
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Employee:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      employee@infieldhub.com
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ============================================
                  2FA VERIFICATION VIEW
                  ============================================ */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 14px',
                    background: '#1E88E5',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 20px rgba(30, 136, 229, 0.35)',
                  }}
                >
                  🔐
                </div>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0D2B4E',
                    margin: 0,
                  }}
                >
                  Verify your identity
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', margin: 0 }}>
                  Enter the 6-digit code sent to
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0D2B4E',
                    marginTop: '2px',
                    marginBottom: 0,
                  }}
                >
                  {email}
                </p>
              </div>

              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    marginBottom: '18px',
                    fontSize: '13px',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handle2FA} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '26px',
                    fontWeight: 800,
                    letterSpacing: '0.5em',
                    textAlign: 'center',
                    color: '#0D2B4E',
                    background: '#F8FAFC',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E88E5';
                    e.target.style.background = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,136,229,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.background = '#F8FAFC';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: loading || code.length !== 6 ? '#94a3b8' : '#2E7D32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? 'Verifying…' : 'Verify & Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNeeds2FA(false);
                    setCode('');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1E88E5',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '6px',
                    fontFamily: 'inherit',
                  }}
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.55)',
            fontSize: '11px',
            marginTop: '20px',
            letterSpacing: '0.05em',
          }}
        >
          © {new Date().getFullYear()} Infield Engineering · All rights reserved
        </p>
      </div>
    </div>
  );
}