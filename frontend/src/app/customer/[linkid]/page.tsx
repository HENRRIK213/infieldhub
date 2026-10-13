'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function CustomerPortal() {
  const pathname = usePathname();

  // ⭐ BULLETPROOF TOKEN EXTRACTION from URL path
  const extractToken = () => {
    if (typeof window === 'undefined') return '';
    // Primary source: window.location.pathname
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean); // ['customer', 'abc-123-...']
    if (parts[0] === 'customer' && parts[1]) return parts[1];
    // Fallback: usePathname
    if (pathname) {
      const p = pathname.split('/').filter(Boolean);
      if (p[0] === 'customer' && p[1]) return p[1];
    }
    return '';
  };

  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const t = extractToken();
    console.log('🔑 Token extracted from URL:', t);
    setToken(t);
  }, [pathname]);

  const [step, setStep] = useState<'verify' | 'store'>('verify');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any>(null);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const expiresAtRef = useRef(0);
  const intervalRef = useRef<any>(null);

  // ============================================================
  // On mount / token change — validate or restore session
  // ============================================================
  useEffect(() => {
    if (!token) return;

    // 1. Restore session
    const stored = localStorage.getItem(`cs_${token}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.expiresAt > Date.now()) {
          expiresAtRef.current = data.expiresAt;
          setEmail(data.email || '');
          setSessionSecs(Math.floor((data.expiresAt - Date.now()) / 1000));
          setStep('store');
          setShowForm(true);
          loadProducts();
          startCountdown();
          return;
        }
        localStorage.removeItem(`cs_${token}`);
      } catch {
        localStorage.removeItem(`cs_${token}`);
      }
    }

    // 2. Validate link with hard 5-second timeout
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setShowForm(true);
    }, 5000);

    api
      .get(`/customers/link/${token}`)
      .then((r) => {
        if (cancelled) return;
        clearTimeout(timeout);
        if (r.data.valid) {
          setShowForm(true);
        } else {
          setError('Link is invalid');
          setShowForm(true);
        }
      })
      .catch((e: any) => {
        if (cancelled) return;
        clearTimeout(timeout);
        const status = e.response?.status;
        if (status === 410) {
          setError(e.response?.data?.error || 'Link expired or invalid');
        } else if (status) {
          setError('Server error. Contact Infield.');
        } else {
          setError('Cannot connect to server.');
        }
        setShowForm(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [token]);

  const startCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const tick = () => {
      const left = expiresAtRef.current - Date.now();
      const s = Math.max(0, Math.floor(left / 1000));
      setSessionSecs(s);
      if (s <= 0) {
        clearInterval(intervalRef.current);
        localStorage.removeItem(`cs_${token}`);
        alert('Your 6-hour session has ended. Request a new link.');
        setStep('verify');
        setCart([]);
        setQuotation(null);
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const loadProducts = async () => {
    try {
      const r = await api.get('/products');
      setProducts(r.data);
    } catch {}
  };

  // ============================================================
  // SEND CODE — now uses the robust token
  // ============================================================
  const sendCode = async () => {
    if (!email) return setError('Enter your email');
    if (!token) return setError('Invalid link — token missing. Regenerate the link.');

    setError('');
    setSuccess('');
    setLoading(true);

    console.log('📤 Sending code:', { email, token });

    try {
      const r = await api.post('/customers/verify/send', { email, token });
      setCodeSent(true);
      setSuccess(
        r.data.emailSent
          ? `✅ Code sent to ${email}. Check your inbox.`
          : `✅ Code generated. Check backend terminal.`
      );
    } catch (e: any) {
      const status = e.response?.status;
      const msg = e.response?.data?.error || 'Failed to send code';
      setError(`${msg}${status ? ` (status ${status})` : ''}`);
      console.error('Send code failed:', e);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY → REDIRECT TO PRODUCTS
  // ============================================================
  const verifyCode = async () => {
    if (code.length !== 6) return setError('Enter the 6-digit code');
    if (!token) return setError('Invalid link — token missing');

    setError('');
    setLoading(true);
    try {
      const r = await api.post('/customers/verify/confirm', { email, code, token });
      const expiresAt = new Date(r.data.sessionExpiresAt).getTime();
      expiresAtRef.current = expiresAt;
      localStorage.setItem(`cs_${token}`, JSON.stringify({ email, expiresAt }));
      await loadProducts();
      setSessionSecs(Math.floor((expiresAt - Date.now()) / 1000));
      setStep('store');
      startCountdown();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CART
  // ============================================================
  const addToCart = (p: any) => {
    if (p.stock <= 0) return alert('Out of stock');
    const ex = cart.find((c) => c.id === p.id);
    if (ex) setCart(cart.map((c) => (c.id === p.id ? { ...c, quantity: c.quantity + 1 } : c)));
    else setCart([...cart, { ...p, quantity: 1 }]);
  };

  const generateQuotation = async () => {
    if (!cart.length) return alert('Add products first');
    setLoading(true);
    try {
      const r = await api.post('/quotations', {
        items: cart.map((c) => ({
          id: c.id,
          name: c.name,
          price: Number(c.price),
          quantity: c.quantity,
          vat: c.vat,
        })),
        customerEmail: email,
      });
      setQuotation(r.data);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to generate quotation');
    } finally {
      setLoading(false);
    }
  };

  const purchase = async () => {
    const src = quotation || {
      items: cart,
      total: cart.reduce((s, c) => s + Number(c.price) * c.quantity, 0),
    };
    if (!src.items.length) return alert('No items');
    const phone = prompt('Enter your M-Pesa phone (254XXXXXXXXX):');
    if (!phone) return;
    if (!/^254\d{9}$/.test(phone)) return alert('Format: 254XXXXXXXXX');
    setLoading(true);
    try {
      await api.post('/payments/initiate', { phone, amount: src.total, email });
      alert('💳 Check your phone. Enter your M-Pesa PIN.');
      setCart([]);
      setQuotation(null);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  };

  // LOADING
  if (!showForm) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D2B4E', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(255,255,255,0.2)', borderTop: '4px solid #4FC3F7', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '14px', color: '#4FC3F7' }}>Loading store…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // VERIFY SCREEN
  if (step === 'verify') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D2B4E 0%, #1565C0 55%, #1E88E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto 12px', background: '#fff', borderRadius: '14px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <img src="/logo.png" alt="Infield" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.style.display = 'none'; if (e.target.parentElement) e.target.parentElement.innerHTML = '<span style="color:#0D2B4E;font-size:22px;font-weight:900">iF</span>'; }} />
            </div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>InfieldStore</h1>
            <p style={{ color: '#4FC3F7', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', marginTop: '6px' }}>
              SOLAR • ELECTRICAL • WATER
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 20px 50px rgba(13,43,78,0.35)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0, textAlign: 'center' }}>
              {codeSent ? 'Enter Your Code' : 'Verify Your Access'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '20px', textAlign: 'center' }}>
              {codeSent ? `Code sent to ${email}` : 'Enter your email to receive a code'}
            </p>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '10px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px' }}>
                {success}
              </div>
            )}

            {!codeSent ? (
              <>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0D2B4E', marginBottom: '6px' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', color: '#0D2B4E', background: '#F8FAFC', outline: 'none', marginBottom: '16px', fontFamily: 'inherit' }}
                />
                <button
                  onClick={sendCode}
                  disabled={loading || !email}
                  style={{ width: '100%', background: loading || !email ? '#94a3b8' : '#0D2B4E', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading || !email ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                >
                  {loading ? 'Sending…' : 'Send Verification Code'}
                </button>
              </>
            ) : (
              <>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0D2B4E', marginBottom: '6px' }}>
                  6-DIGIT CODE
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  style={{ width: '100%', padding: '16px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '28px', fontWeight: 800, letterSpacing: '0.5em', textAlign: 'center', color: '#0D2B4E', background: '#F8FAFC', outline: 'none', marginBottom: '12px', fontFamily: 'monospace' }}
                />
                <button
                  onClick={verifyCode}
                  disabled={loading || code.length !== 6}
                  style={{ width: '100%', background: loading || code.length !== 6 ? '#94a3b8' : '#2E7D32', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer', marginBottom: '8px', fontFamily: 'inherit' }}
                >
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
                <button
                  onClick={() => { setCodeSent(false); setCode(''); setError(''); setSuccess(''); }}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#1E88E5', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
                >
                  ← Change email
                </button>
              </>
            )}

            <div style={{ background: '#E1F5FE', borderRadius: '10px', padding: '10px', marginTop: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: '#0D2B4E', margin: 0, fontWeight: 600 }}>
                🔒 Link valid 6 hours • Session lasts 6 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PRODUCTS PAGE
  return (
    <div style={{ minHeight: '100vh', background: '#F7FAFF', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ background: '#0D2B4E', color: '#fff', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', padding: '4px' }}>
              <img src="/logo.png" alt="Infield" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.style.display = 'none'; if (e.target.parentElement) e.target.parentElement.innerHTML = '<span style="color:#0D2B4E;font-size:14px;font-weight:900">iF</span>'; }} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>InfieldStore</div>
              <div style={{ fontSize: '9px', color: '#4FC3F7', fontWeight: 700, letterSpacing: '0.15em' }}>
                SOLAR • ELECTRICAL • WATER
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Session ends in</div>
              <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'monospace', color: sessionSecs < 3600 ? '#FBBF24' : '#4FC3F7' }}>
                {fmt(sessionSecs)}
              </div>
            </div>
            <div style={{ background: '#4FC3F7', color: '#0D2B4E', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '13px' }}>
              🛒 {cart.length}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Product Store</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            Browse, add to cart, and purchase with M-Pesa
          </p>
        </div>

        {quotation && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '2px solid #1E88E5', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Your Quotation</h2>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Serial: <b>{quotation.serialNumber}</b>
                </p>
              </div>
              <button onClick={() => setQuotation(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#F7FAFF', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              {quotation.items.map((it: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i < quotation.items.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                  <span style={{ color: '#0D2B4E', fontWeight: 600 }}>
                    {it.name} × {it.quantity}
                    {it.vat && <span style={{ fontSize: '10px', color: '#1E40AF', marginLeft: '6px' }}>VAT</span>}
                  </span>
                  <span style={{ color: '#0D2B4E' }}>KES {(Number(it.price) * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span>KES {Number(quotation.subtotal).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>VAT (16%)</span>
                <span>KES {Number(quotation.vatAmount).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '2px solid #0D2B4E', fontSize: '16px', fontWeight: 800 }}>
                <span>TOTAL</span>
                <span style={{ color: '#1E88E5' }}>KES {Number(quotation.total).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#92400E', marginTop: '14px' }}>
              ℹ️ View-only quotation. Only Infield staff can download the PDF.
            </div>

            <button onClick={purchase} disabled={loading} style={{ width: '100%', background: loading ? '#94a3b8' : '#2E7D32', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', marginTop: '14px', fontFamily: 'inherit' }}>
              {loading ? 'Processing…' : `💰 Purchase Now (KES ${Number(quotation.total).toLocaleString()})`}
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(280px, 1fr)', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {products.map((p) => {
              const inStock = p.stock > 0;
              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #F1F5F9', padding: '12px', opacity: inStock ? 1 : 0.65 }}>
                  <div style={{ aspectRatio: '1', background: '#F7FAFF', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                    {p.imageUrl ? (
                      <img src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#CBD5E1' }}>📦</div>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0D2B4E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E88E5', marginTop: '4px' }}>KES {Number(p.price).toLocaleString()}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {inStock ? (
                      <span style={{ fontSize: '10px', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>In Stock</span>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#991B1B', background: '#FEE2E2', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>Out of Stock</span>
                    )}
                    {p.vat && <span style={{ fontSize: '10px', color: '#1E40AF', background: '#DBEAFE', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>VAT</span>}
                  </div>
                  <button disabled={!inStock} onClick={() => addToCart(p)} style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: inStock ? 'pointer' : 'not-allowed', background: inStock ? '#1E88E5' : '#E2E8F0', color: inStock ? '#fff' : '#94a3b8', border: 'none', fontFamily: 'inherit' }}>
                    {inStock ? '+ Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #F1F5F9', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0D2B4E', marginBottom: '16px' }}>Your Cart</h2>
            {cart.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No items yet.</p>
            ) : (
              <>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px' }}>
                  {cart.map((c) => (
                    <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0D2B4E' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.quantity} × KES {Number(c.price).toLocaleString()}</div>
                      </div>
                      <button onClick={() => setCart(cart.filter((x) => x.id !== c.id))} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #0D2B4E', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0D2B4E' }}>TOTAL</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E88E5' }}>
                    KES {cart.reduce((s, c) => s + Number(c.price) * c.quantity, 0).toLocaleString()}
                  </span>
                </div>
                <button onClick={generateQuotation} disabled={loading} style={{ width: '100%', background: '#0D2B4E', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: loading ? 'wait' : 'pointer', marginBottom: '8px', fontFamily: 'inherit' }}>
                  📄 Generate Quotation
                </button>
                <button onClick={purchase} disabled={loading} style={{ width: '100%', background: loading ? '#94a3b8' : '#2E7D32', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Processing…' : '💰 Purchase Now'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}