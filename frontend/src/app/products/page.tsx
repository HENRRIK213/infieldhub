'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const urlParams = new URLSearchParams(window.location.search);
    const hasLinkToken = urlParams.has('link');

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      if (!hasLinkToken) {
        setIsAuthorized(false);
        return;
      }
    }
    
    setIsAuthorized(true);
    
    api.get('/products').then(r => {
      setProducts(r.data.filter((p: any) => p.status === 'APPROVED' || !p.status));
    }).catch(() => {});
  }, []);

  if (!isAuthorized) {
    return (
      <Layout>
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', marginBottom: 10 }}>Private Catalog</h1>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 400 }}>This catalog is private. Please use the secure link provided by your sales representative to view our products.</p>
          <button onClick={() => router.push('/login')} style={{ marginTop: 24, background: '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Employee Login</button>
        </div>
      </Layout>
    );
  }

  const groupedProducts: { [key: string]: any[] } = {};
  products.forEach(p => {
    const cat = p.category || 'General Products';
    if (!groupedProducts[cat]) groupedProducts[cat] = [];
    groupedProducts[cat].push(p);
  });

  const filteredCategories = Object.keys(groupedProducts).filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase()) || 
    groupedProducts[cat].some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const availableTypes = selectedCategory 
    ? [...new Set(groupedProducts[selectedCategory].map(p => p.type || p.size).filter(Boolean))] 
    : [];

  const finalProducts = (selectedCategory && selectedType)
    ? groupedProducts[selectedCategory].filter(p => (p.type || p.size) === selectedType)
    : [];

  return (
    <Layout>
      <div style={{ background: '#0D2B4E', padding: '60px 20px', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Premium Energy Solutions</h1>
        <p style={{ fontSize: 18, color: '#cbd5e1', marginBottom: 32 }}>Select a category to view available models and brands.</p>
        
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '16px 24px', borderRadius: 30, border: 'none', fontSize: 16, outline: 'none' }} />
          <span style={{ position: 'absolute', right: 24, top: 16, fontSize: 20 }}>🔍</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        {(selectedCategory || selectedType) && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 8, fontSize: 14, fontWeight: 600, color: '#64748b' }}>
            <span onClick={() => { setSelectedCategory(null); setSelectedType(null); }} style={{ cursor: 'pointer', color: '#1E88E5' }}>All Categories</span>
            {selectedCategory && <span>/ {selectedCategory}</span>}
            {selectedType && <span>/ {selectedType}</span>}
          </div>
        )}

        {!selectedCategory && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filteredCategories.map(cat => (
              <div key={cat} onClick={() => setSelectedCategory(cat)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>{cat}</h3>
                <p style={{ color: '#64748b', fontSize: 14 }}>{groupedProducts[cat].length} variations available</p>
                <button style={{ marginTop: 20, background: '#1E88E5', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 700, border: 'none', width: '100%' }}>View Types</button>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && !selectedType && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', marginBottom: 24 }}>{selectedCategory}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {availableTypes.map(t => (
                <div key={t} onClick={() => setSelectedType(t as string)} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1E88E5'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E' }}>{t}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Click to view brands</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && selectedType && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E' }}>{selectedType}</h2>
              <button onClick={() => setSelectedType(null)} style={{ background: '#F1F5F9', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', color: '#0D2B4E' }}>← Change Type</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {finalProducts.map(p => (
                <div key={p.id} onClick={() => router.push(`/products/${p.id}`)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: 160, background: '#F8FAFC', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.imageUrl ? <img src={`${UPLOADS_URL}${p.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 40 }}>📦</span>}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1E88E5', textTransform: 'uppercase' }}>{p.brand}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0D2B4E', marginTop: 4 }}>{p.name}</h3>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E' }}>KSH {p.price.toLocaleString()}</span>
                    <button style={{ background: '#0D2B4E', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700, border: 'none' }}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
