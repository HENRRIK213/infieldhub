'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const [activeModalProduct, setActiveModalProduct] = useState<any>(null);
  const [modalSizes, setModalSizes] = useState<string[]>([]);
  const [modalBrands, setModalBrands] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [finalChildId, setFinalChildId] = useState('');

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const BASE_URL = 'https://infieldhub-backend.onrender.com';
    return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.role === 'ADMIN') setIsAdmin(true);

    api.get('/products').then(r => {
      setProducts(r.data);
      setFiltered(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) setFiltered(products);
    else setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  const openOptionsModal = (product: any) => {
    setActiveModalProduct(product);
    setSelectedSize(''); setSelectedBrand(''); setFinalChildId(''); setModalBrands([]);
    
    if (product.children && product.children.length > 0) {
      // EXTRACT SIZES FROM CHILDREN
      const uniqueSizes = Array.from(new Set(product.children.map((c: any) => c.size).filter(Boolean))) as string[];
      setModalSizes(uniqueSizes);
    } else {
      setModalSizes([]);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size); setSelectedBrand(''); setFinalChildId('');
    const filteredChildren = activeModalProduct.children.filter((c: any) => c.size === size);
    const uniqueBrands = Array.from(new Set(filteredChildren.map((c: any) => c.brand).filter(Boolean))) as string[];
    setModalBrands(uniqueBrands);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    const exactChild = activeModalProduct.children.find((c: any) => c.size === selectedSize && c.brand === brand);
    if (exactChild) setFinalChildId(exactChild.id);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)', padding: '60px 20px 80px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px 0' }}>Premium Energy Solutions</h1>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '18px 30px', borderRadius: 999, border: 'none', fontSize: 16, outline: 'none' }} />
          <span style={{ position: 'absolute', right: 24, top: 18, fontSize: 20 }}>🔍</span>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '-40px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {loading ? ( <div style={{ textAlign: 'center', padding: 60, fontSize: 18 }}>Loading...</div> ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30 }}>
            {filtered.map((p: any) => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(13,43,78,0.05)', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                {isAdmin && (
                  <button onClick={() => router.push(`/products/admin?edit=${p.id}`)} style={{ position: 'absolute', top: 12, left: 12, background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', zIndex: 10, fontSize: 11 }}>✏️ Edit Product</button>
                )}
                <div style={{ height: 220, background: '#F8FAFC', position: 'relative', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
                  {p.imageUrl ? ( <img src={getImageUrl(p.imageUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>📦</div>}
                  <span style={{ position: 'absolute', top: 16, right: 16, background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 800 }}>{p.category}</span>
                </div>
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0' }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0', flex: 1 }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5' }}>KSH {Number(p.price).toLocaleString()}</div>
                    <button onClick={() => openOptionsModal(p)} style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13 }}>View Types</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeModalProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,43,78,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 500, borderRadius: 20, padding: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: '0 0 4px 0' }}>Select Options</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{activeModalProduct.name}</p>
              </div>
              <button onClick={() => setActiveModalProduct(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D2B4E', marginBottom: 8 }}>1. Select Size / Type</label>
              <select value={selectedSize} onChange={e => handleSizeSelect(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }}>
                <option value="">-- Choose Size --</option>
                {modalSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {selectedSize && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0D2B4E', marginBottom: 8 }}>2. Select Brand</label>
                <select value={selectedBrand} onChange={e => handleBrandSelect(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }}>
                  <option value="">-- Choose Brand --</option>
                  {modalBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            <button onClick={() => finalChildId && router.push(`/products/${finalChildId}`)} disabled={!finalChildId} style={{ width: '100%', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 16, cursor: finalChildId ? 'pointer' : 'not-allowed', background: finalChildId ? '#1E88E5' : '#cbd5e1', color: '#fff' }}>
              {finalChildId ? 'View Exact Product & Buy →' : 'Select Size & Brand'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
