'use client';
import Layout from '@/components/Layout';
import { api, getImageSrc } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const mainCategories = [
  'Water Meters',
  'Pump Ends',
  'Sub-Motors',
  'Submersible Cables',
  'UPVC Drop Pipes',
  'Solar Pump Inverters',
  'Control Panels',
  'AC Output Reactors',
  'PV Disconnects',
  'Surge Protectors',
  'Non-Return Valves',
  'Borehole Covers',
  'Accessories',
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [invalidInvitation, setInvalidInvitation] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      localStorage.removeItem('user');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const isStaff = user && (user.role === 'ADMIN' || user.role === 'EMPLOYEE');
    const isCustomer = user && user.role === 'CUSTOMER';

    if (!isStaff && !isCustomer) {
      setInvalidInvitation(urlParams.has('link'));
      setIsAuthorized(false);
      return;
    }
    
    setIsAuthorized(true);
    
    setProductsLoading(true);
    api.get('/products').then(r => {
      if (!Array.isArray(r.data)) throw new Error('Unexpected product catalog response');
      setProducts(r.data.filter((p: any) => p.status === 'APPROVED' || !p.status));
      setProductsError('');
    }).catch((error) => {
      console.error('Failed to load product catalog:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthorized(false);
      } else {
        setProductsError('We could not load product details. The catalog service may be unavailable; try again shortly.');
      }
    }).finally(() => setProductsLoading(false));
  }, []);

  if (!isAuthorized) {
    return (
      <Layout>
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D2B4E', marginBottom: 10 }}>Private Catalog</h1>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 400 }}>
            {invalidInvitation
              ? 'Link Invalid or Expired. Please contact your administrator to request a new link.'
              : 'Please use the secure link provided by your sales representative to view our products.'}
          </p>
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

  const filteredCategories = mainCategories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (groupedProducts[cat] || []).some((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const availableTypes = selectedCategory 
    ? [...new Set((groupedProducts[selectedCategory] || []).map(p => p.type || 'Other'))]
    : [];

  const availableSizes = (selectedCategory && selectedType)
    ? [...new Set((groupedProducts[selectedCategory] || [])
        .filter(p => (p.type || 'Other') === selectedType)
        .map(p => p.size || 'Other'))]
    : [];

  const finalProducts = (selectedCategory && selectedType && selectedSize)
    ? (groupedProducts[selectedCategory] || []).filter(p => (p.type || 'Other') === selectedType && (p.size || 'Other') === selectedSize)
    : [];
  const brandProducts = [...new Map(finalProducts.map((product) => [product.brand || 'Generic', product])).values()];

  return (
    <Layout>
      <div style={{ background: '#0D2B4E', padding: '60px 20px', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Premium Energy Solutions</h1>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <input type="text" placeholder="Search main categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '16px 24px', borderRadius: 30, border: 'none', fontSize: 16, outline: 'none' }} />
          <span style={{ position: 'absolute', right: 24, top: 16, fontSize: 20 }}>🔍</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        {productsError && (
          <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: 14, borderRadius: 8, marginBottom: 20 }}>
            {productsError}
            <button onClick={() => { setProductsError(''); setProductsLoading(true); api.get('/products').then(r => {
              if (!Array.isArray(r.data)) throw new Error('Unexpected product catalog response');
              setProducts(r.data.filter((p: any) => p.status === 'APPROVED' || !p.status));
            }).catch((error) => { console.error('Product catalog retry failed:', error); setProductsError('The product catalog is still unavailable. Please try again later.'); }).finally(() => setProductsLoading(false)); }} style={{ marginLeft: 12, color: '#991B1B', textDecoration: 'underline', background: 'none', border: 0, cursor: 'pointer', fontWeight: 700 }}>
              Retry
            </button>
          </div>
        )}
        {productsLoading && <p role="status" style={{ color: '#64748b', marginBottom: 16 }}>Loading product catalog…</p>}
        {(selectedCategory || selectedType || selectedSize) && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 8, fontSize: 14, fontWeight: 600, color: '#64748b', flexWrap: 'wrap' }}>
            <span onClick={() => { setSelectedCategory(null); setSelectedType(null); setSelectedSize(null); }} style={{ cursor: 'pointer', color: '#1E88E5' }}>All Main Products</span>
            {selectedCategory && <span onClick={() => { setSelectedType(null); setSelectedSize(null); }} style={{ cursor: 'pointer' }}> / {selectedCategory}</span>}
            {selectedType && <span onClick={() => { setSelectedSize(null); }} style={{ cursor: 'pointer', color: '#1E88E5' }}> / {selectedType}</span>}
            {selectedSize && <span> / {selectedSize}</span>}
          </div>
        )}

        {!selectedCategory && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filteredCategories.map(cat => (
              <div key={cat} onClick={() => setSelectedCategory(cat)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>{cat}</h3>
              <p style={{ color: '#64748b', fontSize: 14 }}>{(groupedProducts[cat] || []).length} products</p>
                <button style={{ marginTop: 20, background: '#1E88E5', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 700, border: 'none', width: '100%' }}>View Types</button>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && !selectedType && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', marginBottom: 24 }}>{selectedCategory} - Select Type</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {availableTypes.map(t => (
                <div key={t} onClick={() => setSelectedType(t as string)} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E' }}>{t}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Click to view sizes</p>
                </div>
              ))}
            </div>
            {availableTypes.length === 0 && !productsLoading && !productsError && <p style={{ color: '#64748b' }}>No types are available in this category yet. Please contact an administrator.</p>}
          </div>
        )}

        {selectedCategory && selectedType && !selectedSize && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E' }}>{selectedType} - Select Size</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {availableSizes.map(s => (
                <div key={s} onClick={() => setSelectedSize(s as string)} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E' }}>{s}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Click to view brands</p>
                </div>
              ))}
            </div>
            {availableSizes.length === 0 && <p style={{ color: '#64748b' }}>No sizes are available for this type yet.</p>}
          </div>
        )}

        {selectedCategory && selectedType && selectedSize && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E' }}>{selectedSize} - Select Brand</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {brandProducts.map(p => (
                <div key={p.id} onClick={() => router.push(`/products/${p.id}`)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: 160, background: '#F8FAFC', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.imageUrl ? <img src={getImageSrc(p.imageUrl)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 40 }}>📦</span>}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1E88E5', textTransform: 'uppercase' }}>{p.brand || 'Generic'}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0D2B4E', marginTop: 4 }}>{p.name}</h3>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#0D2B4E' }}>KSH {p.price.toLocaleString()}</span>
                    <button style={{ background: '#0D2B4E', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700, border: 'none' }}>Select</button>
                  </div>
                </div>
              ))}
            </div>
            {brandProducts.length === 0 && <p style={{ color: '#64748b' }}>No brands are available for this size yet.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
}