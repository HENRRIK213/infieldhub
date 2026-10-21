'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0D2B4E', marginBottom: 10, textAlign: 'center' }}>Our Products</h1>
      <p style={{ color: '#64748b', textAlign: 'center', marginBottom: 40 }}>Click on any product to view available types and specifications.</p>

      {loading ? <div style={{ textAlign: 'center' }}>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {products.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => router.push(`/products/${p.id}`)}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: 220, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `${UPLOADS_URL}${p.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <span style={{ fontSize: 48 }}>📦</span>}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E', margin: 0 }}>{p.name}</h3>
                  <span style={{ fontSize: 11, background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{p.category}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description || 'No description available.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1E88E5' }}>KSH {p.price.toLocaleString()}</span>
                  <button style={{ background: '#0D2B4E', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700, border: 'none', fontSize: 12 }}>View Types</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
