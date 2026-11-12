'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Payment States
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('M-PESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  
  // Flow: 'input' -> 'prompt_sent' -> 'pin_entry' -> 'processing' -> 'success' | 'failed'
  const [paymentStep, setPaymentStep] = useState<'input' | 'prompt_sent' | 'pin_entry' | 'processing' | 'success' | 'failed'>('input');

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}?t=${Date.now()}`)
      .then(r => { 
        if (!r.data || r.data.error) {
          setError("Product not found. Redirecting...");
          setTimeout(() => router.push('/products'), 2000);
        } else {
          setProduct(r.data); 
        }
        setLoading(false); 
      })
      .catch(() => { 
        setError("Failed to load product."); 
        setLoading(false); 
      });
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Added to cart!');
  };

  // Step 1: User enters phone number
  const initiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) { 
      alert("Please enter a valid phone number."); 
      return; 
    }
    setPaymentStep('prompt_sent');
    
    // Simulate the STK push taking 2 seconds to reach the phone
    setTimeout(() => {
      setPaymentStep('pin_entry');
    }, 2000);
  };

  // Step 2: User enters PIN
  const confirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) { 
      alert("Please enter a valid 4-digit PIN."); 
      return; 
    }
    
    setPaymentStep('processing');

    // Simulate the bank verifying the PIN and funds
    setTimeout(() => {
      // DUMMY LOGIC FOR TESTING:
      // If the PIN is 0000, we simulate an "Insufficient Funds" error.
      // Any other PIN (e.g., 1234) will be a success.
      if (pin === '0000') {
        setPaymentStep('failed');
      } else {
        setPaymentStep('success');
      }
    }, 3000);
  };

  const closeModal = () => {
    setShowPayment(false);
    setPaymentStep('input');
    setPin('');
    if (paymentStep === 'success') router.push('/products');
  };

  if (loading) return <Layout><div style={{ padding: 100, textAlign: 'center' }}>Loading...</div></Layout>;
  if (error) return <Layout><div style={{ padding: 100, textAlign: 'center', color: 'red' }}>{error}</div></Layout>;
  if (!product) return null;

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        <button onClick={() => router.push('/products')} style={{ marginBottom: 24, background: '#F1F5F9', border: 'none', padding: '10px 20px', borderRadius: 8, color: '#0D2B4E', fontWeight: 700, cursor: 'pointer' }}>← Back to Catalog</button>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          <div style={{ background: '#F8FAFC', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflow: 'hidden' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/F8FAFC/0D2B4E?text=${encodeURIComponent(product.category)}`; }} />
          </div>
          
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1E88E5', textTransform: 'uppercase' }}>{product.brand}</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', margin: '8px 0 16px 0' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ background: '#E1F5FE', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#0277BD' }}>{product.category}</span>
              <span style={{ background: '#F1F5F9', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#475569' }}>{product.type} • {product.size}</span>
            </div>

            <div style={{ fontSize: 36, fontWeight: 900, color: '#0D2B4E', marginBottom: 32 }}>KES {product.price.toLocaleString()}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button onClick={handleAddToCart} style={{ width: '100%', padding: 16, background: '#FFC107', color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>🛒 Add to Cart</button>
              <button onClick={() => setShowPayment(true)} style={{ width: '100%', padding: 16, background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>⚡ Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,43,78,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 500, textAlign: 'center' }}>
            
            {/* STEP 1: ENTER PHONE */}
            {paymentStep === 'input' && (
              <form onSubmit={initiatePayment}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Complete Payment</h2>
                <p style={{ color: '#64748b', marginBottom: 24 }}>Amount: <strong>KES {product.price.toLocaleString()}</strong></p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  {['M-PESA', 'Kingdom Bank', 'Co-op Bank'].map(m => (
                    <div key={m} onClick={() => setPaymentMethod(m)} style={{ flex: 1, padding: 12, textAlign: 'center', border: paymentMethod === m ? '2px solid #1E88E5' : '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 700, background: paymentMethod === m ? '#E1F5FE' : '#fff' }}>{m}</div>
                  ))}
                </div>
                <div style={{ marginBottom: 24, textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#0D2B4E', marginBottom: 8 }}>Phone Number</label>
                  <input required type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g. 0712345678" style={{ width: '100%', padding: 14, border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16 }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="button" onClick={closeModal} style={{ flex: 1, padding: 16, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 16, background: '#2E7D32', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Send Request</button>
                </div>
              </form>
            )}

            {/* STEP 2: WAITING FOR PROMPT */}
            {paymentStep === 'prompt_sent' && (
              <div style={{ padding: '40px 0' }}>
                <div style={{ width: 60, height: 60, border: '5px solid #E2E8F0', borderTop: '5px solid #1E88E5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Sending Request...</h2>
                <p style={{ color: '#64748b' }}>Please wait while we send a prompt to <strong>{phoneNumber}</strong>.</p>
              </div>
            )}

            {/* STEP 3: ENTER PIN */}
            {paymentStep === 'pin_entry' && (
              <form onSubmit={confirmPin}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📱</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Enter PIN</h2>
                <p style={{ color: '#64748b', marginBottom: 24 }}>A prompt of <strong>KES {product.price.toLocaleString()}</strong> has been sent to <strong>{phoneNumber}</strong>. Enter your PIN to authorize the transfer to <strong>{paymentMethod}</strong>.</p>
                <div style={{ marginBottom: 24 }}>
                  <input required type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" style={{ width: '200px', margin: '0 auto', padding: 14, border: '2px solid #cbd5e1', borderRadius: 8, fontSize: 24, textAlign: 'center', letterSpacing: 10 }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="button" onClick={() => setPaymentStep('input')} style={{ flex: 1, padding: 16, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 16, background: '#2E7D32', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Confirm PIN</button>
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 16 }}>(For testing: Enter PIN 1234 for Success, or 0000 for Insufficient Funds)</p>
              </form>
            )}

            {/* STEP 4: PROCESSING */}
            {paymentStep === 'processing' && (
              <div style={{ padding: '40px 0' }}>
                <div style={{ width: 60, height: 60, border: '5px solid #E2E8F0', borderTop: '5px solid #2E7D32', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0D2B4E', marginBottom: 8 }}>Verifying with Bank...</h2>
                <p style={{ color: '#64748b' }}>Transferring KES {product.price.toLocaleString()} to {paymentMethod}.</p>
              </div>
            )}

            {/* STEP 5a: SUCCESS */}
            {paymentStep === 'success' && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, background: '#E8F5E9', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40, color: '#2E7D32' }}>✓</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#2E7D32', marginBottom: 8 }}>Payment Successful</h2>
                <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>KES <strong>{product.price.toLocaleString()}</strong> has been successfully transferred to <strong>{paymentMethod}</strong>.</p>
                
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24, textAlign: 'left' }}>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}><strong>Status:</strong> Approved</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}><strong>Pickup Status:</strong> <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>Ready for Pickup</span></p>
                  <p style={{ fontSize: 13, color: '#64748b' }}><strong>Notifications:</strong> Receipt sent to {phoneNumber} & Admin</p>
                </div>
                <button onClick={closeModal} style={{ width: '100%', padding: 16, background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Back to Catalog</button>
              </div>
            )}

            {/* STEP 5b: FAILED */}
            {paymentStep === 'failed' && (
              <div style={{ padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, background: '#FEF2F2', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40, color: '#B91C1C' }}>✕</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#B91C1C', marginBottom: 8 }}>Transaction Failed</h2>
                <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>Insufficient funds in your account. The transfer of KES {product.price.toLocaleString()} was rejected.</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={closeModal} style={{ flex: 1, padding: 16, background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => setPaymentStep('input')} style={{ flex: 1, padding: 16, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </Layout>
  );
}
