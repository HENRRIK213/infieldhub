'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ExactProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment State
  const [phone, setPhone] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const BASE_URL = 'https://infieldhub-backend.onrender.com';
    return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  };

  useEffect(() => {
    if (params.id) {
      api.get(`/products/${params.id}`)
        .then(r => setProduct(r.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert('Please enter your M-Pesa phone number');
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPaySuccess(true);
      setTimeout(() => setPaySuccess(false), 5000);
    }, 2000);
  };

  if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: 100, textAlign: 'center' }}>Product not found.</div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#1E88E5', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            ← Back to Products
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap' }}>
          
          {/* Left: Image */}
          <div style={{ width: '50%', minWidth: 300, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50 }}>
             {product.imageUrl ? (
                <img src={getImageUrl(product.imageUrl)} style={{ maxHeight: 400, maxWidth: '100%', objectFit: 'contain' }} />
              ) : <span style={{ fontSize: 120, opacity: 0.2 }}>📦</span>}
          </div>

          {/* Right: Details */}
          <div style={{ width: '50%', minWidth: 300, padding: 50, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, alignSelf: 'flex-start', marginBottom: 16 }}>
              {product.brand || product.category}
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0', lineHeight: 1.3 }}>{product.name}</h1>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{product.description}</p>
            
            <div style={{ fontSize: 40, fontWeight: 800, color: '#1E88E5', marginBottom: 30 }}>
              KSH {Number(product.price).toLocaleString()}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', padding: 20, borderRadius: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#166534', marginBottom: 12 }}>Pay via M-Pesa (Till: 400200)</div>
                {paySuccess ? (
                  <div style={{ color: '#15803D', fontWeight: 800, fontSize: 15 }}>✅ STK Push sent! Check your phone.</div>
                ) : (
                  <form onSubmit={handlePay} style={{ display: 'flex', gap: 10 }}>
                    <input type="tel" placeholder="07XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, padding: '14px', border: '1px solid #86EFAC', borderRadius: 8, outline: 'none' }} />
                    <button type="submit" disabled={payLoading} style={{ background: '#166534', color: '#fff', padding: '0 24px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer' }}>{payLoading ? 'Sending...' : 'Pay Now'}</button>
                  </form>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer' }}>🛒 Add to Cart</button>
                <button style={{ flex: 1, background: '#0D2B4E', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer' }}>🧾 Get Quote</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
