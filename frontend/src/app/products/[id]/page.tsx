'use client';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizes, setSizes] = useState<string[]>([]);

  // Modal State
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Ref for scrolling
  const step2Ref = useRef<HTMLDivElement>(null);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const BASE_URL = 'https://infieldhub-backend.onrender.com';
    return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  };

  useEffect(() => {
    if (params.id) {
      api.get(`/products/${params.id}`)
        .then(r => {
          const p = r.data;
          setProduct(p);
          
          // Extract sizes from the children names
          if (p.children && p.children.length > 0) {
            const uniqueSizes = new Set<string>();
            p.children.forEach((c: any) => {
              // Improved regex for cables, pumps, etc.
              const match = c.name.match(/(\d+(\.\d+)?)\s?(KW|MM2|SP|MFF|RFF|PH|BAR|W|A|INCH|MM)/i);
              if (match) {
                uniqueSizes.add(match[0].toUpperCase().replace(' ', ''));
              } else {
                // If no size found, group by the first few words
                const words = c.name.split(' ');
                uniqueSizes.add(words.slice(0, 4).join(' ').toUpperCase());
              }
            });
            setSizes(Array.from(uniqueSizes));
          }
        })
        .catch((err) => {
          console.error("Failed to load product:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Smoothly scroll down to Step 2
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert('Please enter your M-Pesa phone number');
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPaySuccess(true);
      setTimeout(() => setPaySuccess(false), 5000);
    }, 2000);
  };

  if (loading) return <div style={{ padding: 80, textAlign: 'center', fontSize: 18 }}>Loading product details...</div>;
  if (!product) return <div style={{ padding: 80, textAlign: 'center', fontSize: 18, color: 'red' }}>Error loading product. Please go back.</div>;

  // Filter children based on selected size
  const filteredChildren = product.children?.filter((sub: any) => {
    if (!selectedSize) return true;
    // Remove spaces from both for a looser match
    const subNameClean = sub.name.replace(/\s+/g, '').toLowerCase();
    const selectedSizeClean = selectedSize.replace(/\s+/g, '').toLowerCase();
    return subNameClean.includes(selectedSizeClean);
  }) || [];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* Top Navigation */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={() => router.push('/products')} style={{ background: 'none', border: 'none', color: '#1E88E5', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            ← Back to All Products
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        
        {/* Main Product Header */}
        <div style={{ display: 'flex', gap: 40, marginBottom: 40, background: '#fff', padding: 40, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', flexWrap: 'wrap' }}>
          <div style={{ width: 250, height: 250, background: '#F8FAFC', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
            {product.imageUrl ? (
              <img src={getImageUrl(product.imageUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : <span style={{ fontSize: 80, opacity: 0.5 }}>📦</span>}
          </div>
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: 16 }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px 0' }}>{product.name}</h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>
          </div>
        </div>

        {/* Step 1: Size Selection */}
        <div style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>Step 1: Select Size / Type</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Choose the specification you need.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {sizes.length > 0 ? sizes.map(size => (
              <button 
                key={size} 
                onClick={() => handleSizeSelect(size)}
                style={{ 
                  padding: '12px 24px', borderRadius: 8, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  background: selectedSize === size ? '#1E88E5' : '#F1F5F9',
                  color: selectedSize === size ? '#fff' : '#0D2B4E',
                  border: selectedSize === size ? '1px solid #1E88E5' : '1px solid #cbd5e1',
                  transition: 'all 0.2s', boxShadow: selectedSize === size ? '0 4px 12px rgba(30,136,229,0.3)' : 'none'
                }}
              >
                {size}
              </button>
            )) : <span style={{color: '#64748b', fontStyle: 'italic'}}>No specific sizes listed. See brands below.</span>}
          </div>
        </div>

        {/* Step 2: Brand Selection (Scrolls into view) */}
        <div ref={step2Ref} style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>Step 2: Select Brand / Model</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>
            {selectedSize ? `Showing brands available for ${selectedSize}` : 'Showing all available brands.'}
          </p>
          
          {filteredChildren.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: '#F8FAFC', borderRadius: 12, color: '#64748b' }}>
              No brands found for this selection. Please try a different size or go back.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {filteredChildren.map((sub: any) => (
                <div 
                  key={sub.id} 
                  onClick={() => setSelectedModel(sub)}
                  style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }} 
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                     {sub.imageUrl ? (
                        <img src={getImageUrl(sub.imageUrl)} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      ) : <span style={{ fontSize: 48, opacity: 0.3 }}>⚙️</span>}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', margin: '0 0 8px 0', flex: 1, lineHeight: 1.4 }}>{sub.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: 16, marginTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Price</div>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#1E88E5' }}>KSH {Number(sub.price).toLocaleString()}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: '#0D2B4E', padding: '8px 16px', borderRadius: 6 }}>View</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Step 3: EXACT PRODUCT CARD MODAL */}
      {selectedModel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13, 43, 78, 0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 850, borderRadius: 24, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            {/* Left: Image */}
            <div style={{ width: '50%', minWidth: 300, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
               {selectedModel.imageUrl ? (
                  <img src={getImageUrl(selectedModel.imageUrl)} style={{ maxHeight: 350, maxWidth: '100%', objectFit: 'contain' }} />
                ) : <span style={{ fontSize: 100, opacity: 0.2 }}>📦</span>}
            </div>

            {/* Right: Details & Actions */}
            <div style={{ width: '50%', minWidth: 300, padding: 40, display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setSelectedModel(null)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', marginBottom: 10, color: '#64748b' }}>×</button>
              
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', margin: '0 0 12px 0', lineHeight: 1.3 }}>{selectedModel.name}</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{selectedModel.description || 'Genuine high-quality product from InfieldHub.'}</p>
              
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1E88E5', marginBottom: 30 }}>
                KSH {Number(selectedModel.price).toLocaleString()}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* PAYMENT FORM */}
                <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', padding: 20, borderRadius: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#166534', marginBottom: 12 }}>Pay via M-Pesa (Till: 400200)</div>
                  {paySuccess ? (
                    <div style={{ color: '#15803D', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>✅ STK Push sent! Check your phone.</div>
                  ) : (
                    <form onSubmit={handlePay} style={{ display: 'flex', gap: 10 }}>
                      <input 
                        type="tel" placeholder="07XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)}
                        style={{ flex: 1, padding: '14px', border: '1px solid #86EFAC', borderRadius: 8, outline: 'none', fontSize: 15 }} 
                      />
                      <button type="submit" disabled={payLoading} style={{ background: '#166534', color: '#fff', padding: '0 24px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
                        {payLoading ? 'Sending...' : 'Pay Now'}
                      </button>
                    </form>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
                    🛒 Add to Cart
                  </button>
                  <button style={{ flex: 1, background: '#0D2B4E', color: '#fff', padding: '16px', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
                    🧾 Get Quote
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
