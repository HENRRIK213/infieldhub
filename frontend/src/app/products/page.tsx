'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Bulletproof image URL formatter
  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${UPLOADS_URL}${path}`;
  };

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data);
      setFiltered(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) setFiltered(products);
    else setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 60 }}>
      
      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #0D2B4E 0%, #1E88E5 100%)', padding: '60px 20px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>Premium Energy Solutions</h1>
        <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 600, margin: '0 auto 30px' }}>
          Explore our range of high-quality solar panels, water pumps, electrical components, and more.
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products or categories..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '16px 24px', borderRadius: 999, border: 'none', fontSize: 15, outline: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          />
          <span style={{ position: 'absolute', right: 24, top: 16, fontSize: 18 }}>🔍</span>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ maxWidth: 1300, margin: '-30px auto 0', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#64748b' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#64748b' }}>No products found matching your search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30 }}>
            {filtered.map((p: any) => (
              <div 
                key={p.id} 
                onClick={() => router.push(`/products/${p.id}`)}
                style={{ 
                  background: '#fff', borderRadius: 20, overflow: 'hidden', 
                  boxShadow: '0 4px 20px rgba(13, 43, 78, 0.05)', 
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(13, 43, 78, 0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(13, 43, 78, 0.05)';
                }}
              >
                {/* Image Container */}
                <div style={{ height: 240, background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
                  {p.imageUrl ? (
                    <img 
                      src={getImageUrl(p.imageUrl) || ''} 
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>📦</div>
                  )}
                  <span style={{ position: 'absolute', top: 16, right: 16, background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                    {p.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0', lineHeight: 1.2 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {p.description || 'Explore different types and specifications for this product.'}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>From</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#1E88E5' }}>KSH {Number(p.price).toLocaleString()}</div>
                    </div>
                    <button style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
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
