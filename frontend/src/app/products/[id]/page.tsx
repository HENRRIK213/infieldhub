'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  
  // Available Options
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  // Final Selected Product Card
  const [finalProduct, setFinalProduct] = useState<any>(null);
  
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
        .then(r => {
          const p = r.data;
          setProduct(p);
          
          if (p.children && p.children.length > 0) {
            // Extract unique sizes
            const uniqueSizes = [...new Set(p.children.map((c: any) => c.size).filter(Boolean))] as string[];
            setSizes(uniqueSizes);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  // When Size changes, update available brands
  useEffect(() => {
    if (selectedSize && product.children) {
      const filtered = product.children.filter((c: any) => c.size === selectedSize);
      const uniqueBrands = [...new Set(filtered.map((c: any) => c.brand).filter(Boolean))] as string[];
      setBrands(uniqueBrands);
      setSelectedBrand(''); // Reset brand
      setFinalProduct(null);
    } else {
      setBrands([]);
    }
  }, [selectedSize, product]);

  // When Brand changes, find the exact product
  useEffect(() => {
    if (selectedSize && selectedBrand && product.children) {
      const exactProduct = product.children.find((c: any) => c.size === selectedSize && c.brand === selectedBrand);
      setFinalProduct(exactProduct);
    }
  }, [selectedBrand, selectedSize, product]);

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

  if (loading) return <div style={{ padding: 100, textAlign: 'center', fontSize: 18 }}>Loading...</div>;
  if (!product) return <div style={{ padding: 100, textAlign: 'center', fontSize: 18 }}>Product not found.</div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#1E88E5', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            ← Back to All Products
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        
        {/* Main Header */}
        <div style={{ background: '#fff', padding: 40, borderRadius: 24, border: '1px solid #e2e8f0', marginBottom: 40, textAlign: 'center' }}>
          <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, display: 'inline-block' }}>{product.category}</span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>{product.name}</h1>
          <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>{product.description}</p>
        </div>

        {/* Dropdown Flow */}
        <div style={{ background: '#fff', padding: 40, borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          
          {/* Step 1: Size Dropdown */}
          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', fontSize: 16, fontWeight: 800, color: '#0D2B4E', marginBottom: 12 }}>Step 1: Select Size / Type</label>
            <select 
              value={selectedSize} 
              onChange={e => setSelectedSize(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, fontWeight: 600, color: '#0D2B4E', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Choose a size --</option>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Step 2: Brand Dropdown (Only shows if size is selected) */}
          {selectedSize && (
            <div style={{ marginBottom: 30 }}>
              <label style={{ display: 'block', fontSize: 16, fontWeight: 800, color: '#0D2B4E', marginBottom: 12 }}>Step 2: Select Brand / Company</label>
              <select 
                value={selectedBrand} 
                onChange={e => setSelectedBrand(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, fontWeight: 600, color: '#0D2B4E', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">-- Choose a brand --</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}

          {/* Step 3: Final Product Card (Shows when both are selected) */}
          {finalProduct && (
            <div style={{ marginTop: 40, borderTop: '2px dashed #e2e8f0', paddingTop: 40, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              
              <div style={{ width: '100%', maxWidth: 300, height: 300, background: '#F8FAFC', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                {finalProduct.imageUrl ? (
                  <img src={getImageUrl(finalProduct.imageUrl)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : <span style={{ fontSize: 80, opacity: 0.3 }}>📦</span>}
              </div>

              <div style={{ flex: 1, minWidth: 300 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0' }}>{finalProduct.name}</h2>
                <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{finalProduct.description}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#1E88E5', marginBottom: 30 }}>KSH {Number(finalProduct.price).toLocaleString()}</div>

                {/* M-Pesa Payment Box */}
                <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', padding: 20, borderRadius: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#166534', marginBottom: 12 }}>Pay via M-Pesa (Till: 400200)</div>
                  {paySuccess ? (
                    <div style={{ color: '#15803D', fontWeight: 800, fontSize: 15 }}>✅ STK Push sent! Check your phone.</div>
                  ) : (
                    <form onSubmit={handlePay} style={{ display: 'flex', gap: 10 }}>
                      <input type="tel" placeholder="07XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, padding: '14px', border: '1px solid #86EFAC', borderRadius: 8, outline: 'none', fontSize: 15 }} />
                      <button type="submit" disabled={payLoading} style={{ background: '#166534', color: '#fff', padding: '0 24px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>{payLoading ? 'Sending...' : 'Pay Now'}</button>
                    </form>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>🛒 Add to Cart</button>
                  <button style={{ flex: 1, background: '#0D2B4E', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>🧾 Get Quote</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
