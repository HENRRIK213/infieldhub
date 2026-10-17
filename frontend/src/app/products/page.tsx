'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Products</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 16, border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <h3 style={{ fontSize: 18, color: '#0D2B4E', margin: 0 }}>No products yet</h3>
            <p style={{ color: '#64748b', marginTop: 8 }}>Click the + button to add your first product.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 6px rgba(13,43,78,0.05)' }}>
                {p.imageUrl ? (
                  <img src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 160, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
                )}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0D2B4E', margin: 0 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1E88E5' }}>KES {Number(p.price).toLocaleString()}</span>
                    <span style={{ fontSize: 11, background: p.status === 'APPROVED' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'APPROVED' ? '#166534' : '#92400E', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* THE ADD BUTTON */}
        <Link
          href="/products/new"
          style={{
            position: 'fixed', bottom: 30, right: 30,
            background: 'linear-gradient(135deg, #1E88E5, #1565C0)', color: '#fff',
            width: 60, height: 60, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 'bold', textDecoration: 'none',
            boxShadow: '0 6px 16px rgba(30,136,229,0.5)', zIndex: 100,
            cursor: 'pointer', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          +
        </Link>
      </div>
    </Layout>
  );
}
