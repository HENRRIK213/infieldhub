'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get(`/products?t=${Date.now()}`)
       .then(r => { setProducts(r.data); setLoading(false); })
       .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); } catch { alert('Failed to delete'); }
  };

  // Group by category
  const groupedProducts: { [key: string]: any[] } = {};
  products.forEach(p => {
    const cat = p.category || 'General Products';
    if (!groupedProducts[cat]) groupedProducts[cat] = [];
    groupedProducts[cat].push(p);
  });

  if (loading) return <Layout requireAdmin><div style={{ padding: 100, textAlign: 'center' }}>Loading...</div></Layout>;

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>📦</span> Product Manager
          </h1>
          <button style={{ background: '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 14 }}>+ Add Main Product</button>
        </div>

        {/* GENERAL PRODUCTS SECTION */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E', margin: 0 }}>📦 General Products</h2>
            <button style={{ background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ Add Sub-Product</button>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {groupedProducts['General Products']?.map(p => (
              <div key={p.id} style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, width: 300, display: 'flex', gap: 16 }}>
                <div style={{ width: 80, height: 80, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 24 }}>📦</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', margin: '0 0 4px 0' }}>{p.name}</h3>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#0D2B4E', margin: '0 0 12px 0' }}>KSH {p.price.toLocaleString()}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '6px 12px', borderRadius: 4, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '6px 12px', borderRadius: 4, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {(!groupedProducts['General Products'] || groupedProducts['General Products'].length === 0) && (
              <p style={{ color: '#64748b', fontSize: 14 }}>No general products found.</p>
            )}
          </div>
        </div>

        {/* CATEGORY SUMMARY TABLE */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#0D2B4E', color: '#fff', padding: '16px 24px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>📦 Product Categories ({Object.keys(groupedProducts).filter(k => k !== 'General Products').length} Categories • {products.length} Products)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 1, background: '#e2e8f0', border: '1px solid #e2e8f0', borderTop: 'none' }}>
            {Object.keys(groupedProducts).filter(k => k !== 'General Products').map(cat => (
              <div key={cat} style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>{cat}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>{groupedProducts[cat].length} Items</p>
                </div>
                <button style={{ background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ Add Product</button>
              </div>
            ))}
          </div>
        </div>

        {/* SAMPLE PRODUCTS GRID */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E', margin: 0 }}>📦 Sample Products from Categories</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {products.filter(p => p.category !== 'General Products').slice(0, 15).map((p) => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ background: '#0D2B4E', color: '#fff', textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {p.brand || 'GENERIC'}
                </div>
                <div style={{ height: 140, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                  {p.imageUrl ? <img src={`${UPLOADS_URL}${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#94a3b8', fontSize: 12 }}>No Image</span>}
                </div>
                <div style={{ padding: 16, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0D2B4E', flex: 1, margin: '0 0 8px 0', lineHeight: 1.4 }}>{p.name}</h3>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E', margin: '0 0 16px 0' }}>KSH {p.price.toLocaleString()}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, background: '#E1F5FE', color: '#0277BD', border: 'none', padding: '8px 0', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ flex: 1, background: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '8px 0', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
