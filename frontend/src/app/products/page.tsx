'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // BULLETPROOF IMAGE URL RESOLVER
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    // Hardcode the production backend URL as a fail-safe
    const BASE_URL = 'https://infieldhub-backend.onrender.com';
    const path = url.startsWith('/') ? url : `/${url}`;
    
    // If UPLOADS_URL is broken or pointing to localhost, use the hardcoded BASE_URL
    const finalBase = (UPLOADS_URL && !UPLOADS_URL.includes('localhost')) 
      ? UPLOADS_URL.replace(/\/$/, '') 
      : BASE_URL;
      
    return `${finalBase}${path}`;
  };

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data);
      setFiltered(r.data);
    }).catch((err) => {
      console.error("Failed to load products", err);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) setFiltered(products);
    else setFiltered(products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
    ));
  }, [search, products]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* CLEAN HERO SECTION (No overlapping) */}
      <div style={{ background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)', padding: '60px 20px 80px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>Premium Energy Solutions</h1>
        <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Explore our range of high-quality solar panels, water pumps, electrical components, and more.
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products or categories..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '18px 30px', borderRadius: 999, border: 'none', fontSize: 16, outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          />
          <span style={{ position: 'absolute', right: 24, top: 18, fontSize: 20, color: '#64748b' }}>🔍</span>
        </div>
      </div>

      {/* PRODUCTS GRID (Cleanly positioned below hero) */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 20px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#64748b' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#64748b', background: '#fff', borderRadius: 16 }}>No products found matching your search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30, alignItems: 'stretch' }}>
            {filtered.map((p: any) => (
              <div 
                key={p.id} 
                onClick={() => router.push(`/products/${p.id}`)}
                style={{ 
                  background: '#fff', borderRadius: 16, overflow: 'hidden', 
                  boxShadow: '0 4px 20px rgba(13, 43, 78, 0.05)', 
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(13, 43, 78, 0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(13, 43, 78, 0.05)';
                }}
              >
                {/* Image Container */}
                <div style={{ height: 220, background: '#F8FAFC', position: 'relative', overflow: 'hidden', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
                  {p.imageUrl && !imageErrors[p.id] ? (
                    <img 
                      src={getImageUrl(p.imageUrl)} 
                      alt={p.name}
                      onError={() => setImageErrors(prev => ({ ...prev, [p.id]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, opacity: 0.4 }}>📦</div>
                  )}
                  <span style={{ position: 'absolute', top: 16, right: 16, background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {p.category || 'Product'}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0', lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, lineHeight: 1.5 }}>
                    {p.description || 'No description available for this product.'}
                  </p>
                  
                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>From</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5', whiteSpace: 'nowrap' }}>
                        KSH {Number(p.price).toLocaleString()}
                      </div>
                    </div>
                    <button style={{ background: '#0D2B4E', color: '#fff', padding: '8px 14px', borderRadius: 8, fontWeight: 700, border: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#1E88E5'} onMouseOut={(e) => e.currentTarget.style.background = '#0D2B4E'}>
                      View Types <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
