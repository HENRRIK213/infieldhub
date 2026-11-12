'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    api.get(`/products?t=${Date.now()}`)
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => { setError("Failed to connect to backend."); setLoading(false); });
  }, []);

  const validProducts = products.filter(p => p.category && p.category.trim() !== '' && p.category !== 'General Products');
  const categories = [...new Set(validProducts.map(p => p.category))].sort();
  
  const types = selectedCategory ? [...new Set(validProducts.filter(p => p.category === selectedCategory).map(p => p.type).filter(Boolean))].sort() : [];
  const sizes = (selectedCategory && selectedType) ? [...new Set(validProducts.filter(p => p.category === selectedCategory && p.type === selectedType).map(p => p.size).filter(Boolean))].sort() : [];
  const brands = (selectedCategory && selectedType && selectedSize) ? validProducts.filter(p => p.category === selectedCategory && p.type === selectedType && p.size === selectedSize) : [];

  const handleBrandSelect = (productId: string) => {
    if (productId) router.push(`/products/${productId}`);
  };

  // EXACT REAL-WORLD IMAGES FOR EVERY CATEGORY
  const categoryImages: { [key: string]: string } = {
    'Pump Ends': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    'Sub-Motors': 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80',
    'Control Panels': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=80',
    'Cables': 'https://images.unsplash.com/photo-1558441710-23c3f38c14a7?w=600&q=80',
    'Solar Inverters': 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=600&q=80',
    'Water Meters': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    'Non-Return Valves': 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80',
    'Solar Solutions': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    'Adapter Sets': 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
    'Borehole Covers': 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
    'DC Breakers': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=80',
    'Inverter Enclosures': 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=600&q=80',
    'PV Disconnects': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=80',
    'Surge Protectors': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=80',
    'UPVC Drop Pipes': 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
    'AC Output Reactors': 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=600&q=80'
  };

  if (loading) return <Layout><div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#0D2B4E', fontSize: 20, fontWeight: 'bold' }}>Loading Catalog...</div></Layout>;

  return (
    <Layout>
      <div style={{ background: '#0D2B4E', padding: '60px 20px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Premium Energy Solutions</h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>Select a main product category below to view available types and specifications.</p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px', background: '#F1F5F9', minHeight: '100vh' }}>
        {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: 20, borderRadius: 8, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              const imgSrc = categoryImages[cat] || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80';
              
              return (
                <div key={cat} style={{ 
                    background: isSelected ? '#F8FAFC' : '#fff', 
                    borderRadius: 12, 
                    border: isSelected ? '2px solid #1E88E5' : '1px solid #e2e8f0', 
                    padding: 20, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? '0 10px 25px rgba(30,136,229,0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                    height: 'fit-content'
                }}>
                  
                  {/* THE IMAGE WITH FALLBACK */}
                  <div style={{ width: '100%', height: 160, background: '#F8FAFC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
                    <img 
                      src={imgSrc} 
                      alt={cat} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        // If image fails, hide it and show the category name instead
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span style="color:#0D2B4E;font-weight:800;font-size:16px;text-align:center;">${cat}</span>`;
                      }}
                    />
                  </div>
                  
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', marginBottom: 16, textAlign: 'center' }}>{cat}</h3>
                  
                  {isSelected ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
                      {selectedSize && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>3. Select Brand</label>
                          <select onChange={(e) => handleBrandSelect(e.target.value)} defaultValue="" style={{ width: '100%', padding: '12px', borderRadius: 6, border: '2px solid #1E88E5', fontWeight: 600, outline: 'none', background: '#E1F5FE', fontSize: 14, cursor: 'pointer' }}>
                            <option value="" disabled>-- Choose Brand --</option>
                            {brands.map(p => <option key={p.id} value={p.id}>{p.brand} - KES {p.price.toLocaleString()}</option>)}
                          </select>
                        </div>
                      )}
                      {selectedType && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>2. Select Size</label>
                          <select onChange={(e) => setSelectedSize(e.target.value)} defaultValue="" style={{ width: '100%', padding: '12px', borderRadius: 6, border: '2px solid #cbd5e1', fontWeight: 600, outline: 'none', background: '#fff', fontSize: 14, cursor: 'pointer' }}>
                            <option value="" disabled>-- Choose Size --</option>
                            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>1. Select Type</label>
                        <select onChange={(e) => { setSelectedType(e.target.value); setSelectedSize(''); }} defaultValue="" style={{ width: '100%', padding: '12px', borderRadius: 6, border: '2px solid #cbd5e1', fontWeight: 600, outline: 'none', background: '#fff', fontSize: 14, cursor: 'pointer' }}>
                          <option value="" disabled>-- Choose Type --</option>
                          {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <button onClick={() => { setSelectedCategory(''); setSelectedType(''); setSelectedSize(''); }} style={{ marginTop: 8, background: 'transparent', color: '#64748b', padding: '4px 0', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setSelectedCategory(cat); setSelectedType(''); setSelectedSize(''); }} style={{ background: '#0D2B4E', color: '#fff', padding: '12px 0', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', width: '100%', cursor: 'pointer' }}>
                      View Types
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </Layout>
  );
}
