'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [finalProduct, setFinalProduct] = useState<any>(null);

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
            // Extract Sizes
            const uniqueSizes = Array.from(new Set(p.children.map((c: any) => c.size).filter(Boolean))) as string[];
            setSizes(uniqueSizes);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  // When Size changes, update Brands
  useEffect(() => {
    if (selectedSize && product) {
      const filtered = product.children.filter((c: any) => c.size === selectedSize);
      const uniqueBrands = Array.from(new Set(filtered.map((c: any) => c.brand).filter(Boolean))) as string[];
      setBrands(uniqueBrands);
      setSelectedBrand('');
      setFinalProduct(null);
    }
  }, [selectedSize, product]);

  // When Brand changes, find exact product
  useEffect(() => {
    if (selectedSize && selectedBrand && product) {
      const exact = product.children.find((c: any) => c.size === selectedSize && c.brand === selectedBrand);
      setFinalProduct(exact);
    }
  }, [selectedBrand, selectedSize, product]);

  if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: 100, textAlign: 'center' }}>Product not found.</div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#1E88E5', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back to Products</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ background: '#fff', padding: 40, borderRadius: 24, border: '1px solid #e2e8f0', marginBottom: 40, textAlign: 'center' }}>
          <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, display: 'inline-block' }}>{product.category}</span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>{product.name}</h1>
        </div>

        {/* Dropdown Flow */}
        <div style={{ background: '#fff', padding: 40, borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          
          <div style={{ marginBottom: 20 }}>
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

          {selectedSize && (
            <div style={{ marginBottom: 20 }}>
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
