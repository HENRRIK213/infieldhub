'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null); // The "Main Product"
  const [selectedType, setSelectedType] = useState(''); // The Size/Type
  
  useEffect(() => {
    api.get('/products').then(r => {
      // Only show approved items to customers
      setProducts(r.data.filter((p: any) => p.status === 'APPROVED' || !p.status));
    }).catch(() => {});
  }, []);

  // Group products by their Main Category
  const groupedProducts: { [key: string]: any[] } = {};
  products.forEach(p => {
    const cat = p.category || 'General Products';
    if (!groupedProducts[cat]) groupedProducts[cat] = [];
    groupedProducts[cat].push(p);
  });

  // If a group is selected, get unique types/sizes for that group
  const availableTypes = selectedGroup 
    ? [...new Set(groupedProducts[selectedGroup].map(p => p.type || p.size).filter(Boolean))] 
    : [];

  // If a type is selected, get unique brands for that type
  const availableBrands = (selectedGroup && selectedType)
    ? [...new Set(groupedProducts[selectedGroup].filter(p => (p.type || p.size) === selectedType).map(p => p.brand).filter(Boolean))]
    : [];

  // Get the final products matching the selection
  const finalProducts = (selectedGroup && selectedType)
    ? groupedProducts[selectedGroup].filter(p => (p.type || p.size) === selectedType)
    : [];

  const handleSelectBrand = (brandName: string) => {
    const exactProduct = finalProducts.find(p => p.brand === brandName);
    if (exactProduct) {
      router.push(`/products/${exactProduct.id}`);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Premium Energy Solutions</h1>
          <p style={{ color: '#64748b', fontSize: 16 }}>Select a category to view available models and brands.</p>
        </div>

        {/* Main Grid */}
        {!selectedGroup ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {Object.keys(groupedProducts).map(cat => (
              <div key={cat} onClick={() => setSelectedGroup(cat)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0D2B4E' }}>{cat}</h3>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>{groupedProducts[cat].length} models available</p>
                <button style={{ marginTop: 20, background: '#0D2B4E', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 700, border: 'none', width: '100%' }}>View Types</button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => { setSelectedGroup(null); setSelectedType(''); }} style={{ marginBottom: 20, background: 'none', border: 'none', color: '#1E88E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              ← Back to Categories
            </button>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: 24 }}>{selectedGroup}</h2>

            {/* Step 2: Select Type/Size */}
            {!selectedType ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {availableTypes.map(t => (
                  <div key={t} onClick={() => setSelectedType(t)} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, cursor: 'pointer', textAlign: 'center' }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1E88E5' }}>{t}</h4>
                  </div>
                ))}
              </div>
            ) : (
              /* Step 3: Select Brand */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E' }}>Select Brand for {selectedType}</h3>
                  <button onClick={() => setSelectedType('')} style={{ background: 'none', border: 'none', color: '#1E88E5', cursor: 'pointer', fontSize: 14 }}>Change Type</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {finalProducts.map(p => (
                    <div key={p.id} onClick={() => router.push(`/products/${p.id}`)} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 60, height: 60, background: '#F8FAFC', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        {p.imageUrl ? <img src={`${UPLOADS_URL}${p.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', paddingTop: 16 }}>📦</div>}
                      </div>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0D2B4E' }}>{p.brand || 'Generic'} {p.size}</h4>
                        <p style={{ fontSize: 13, color: '#1E88E5', fontWeight: 700, marginTop: 4 }}>KSH {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}