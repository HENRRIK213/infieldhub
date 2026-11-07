'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function DocumentsPage() {
  const [documentType, setDocumentType] = useState('QUOTATION');
  const [clientName, setClientName] = useState('THE CLIENT');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const addItem = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    setSelectedItems([...selectedItems, { ...product, qty: 1, vat: true }]);
    setSelectedProductId('');
  };

  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const handleDownload = async () => {
    if (selectedItems.length === 0) {
      alert('Add at least one product before downloading.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/documents/generate', {
        type: documentType,
        clientName,
        items: selectedItems,
      });
      const backendUrl = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5000';
      const url = `${backendUrl}${response.data.pdfUrl}`;
      window.open(url, '_blank');
    } catch (err) {
      alert('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  // Logic for the 3-image strip: Only shows images of added products (max 3)
  const displayImages = selectedItems.map(item => item.imageUrl ? `${UPLOADS_URL}${item.imageUrl}` : null).filter(Boolean).slice(0, 3);

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 24 }}>
        
        {/* LEFT SIDEBAR - FORM */}
        <div style={{ flex: 1, background: '#fff', padding: 24, borderRadius: 12, height: 'fit-content' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Document Settings</h2>
          
          <label style={{ fontSize: 12, fontWeight: 700 }}>Document Type</label>
          <select value={documentType} onChange={e => setDocumentType(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #cbd5e1', borderRadius: 6 }}>
            <option value="QUOTATION">Quotation</option>
            <option value="INVOICE">Invoice</option>
            <option value="REPORT">Report</option>
          </select>

          <label style={{ fontSize: 12, fontWeight: 700 }}>Client Name</label>
          <input value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #cbd5e1', borderRadius: 6 }} />

          <label style={{ fontSize: 12, fontWeight: 700 }}>Add Product</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} style={{ flex: 1, padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }}>
              <option value="">-- Select a product --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={addItem} style={{ background: '#1E88E5', color: '#fff', padding: '0 16px', borderRadius: 6, border: 'none', fontWeight: 700 }}>Add</button>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Selected Items</h3>
          {selectedItems.length === 0 ? <p style={{ fontSize: 12, color: '#64748b' }}>No items selected.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: 10, borderRadius: 6, fontSize: 12 }}>
                  <span>{item.name}</span>
                  <button onClick={() => removeItem(i)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleDownload} disabled={loading} style={{ width: '100%', padding: 14, background: '#0D2B4E', color: '#fff', borderRadius: 8, fontWeight: 700, marginTop: 24, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* RIGHT SIDE - EXACT PDF PREVIEW */}
        <div style={{ flex: 1, background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'flex-start' }}>
             <div>
                <img src="/icon.png" alt="Logo" style={{ height: 40, marginBottom: 10 }} />
                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0' }}>P.O BOX 62700-19052, Meru Township</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>0701243548</p>
             </div>
             <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 5px 0' }}>{new Date().toLocaleDateString()}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Serial: {documentType.slice(0,2)}-2026-1234</p>
                {/* EXACT SOLAR IMAGE - NO TEXT, PURE IMAGE */}
                <img 
                  src="/solar-array.png" 
                  alt="" 
                  style={{ height: 70, objectFit: 'contain', marginTop: 10 }} 
                />
             </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, textAlign: 'center', marginBottom: 30, textDecoration: 'underline', color: '#0D2B4E' }}>
            {documentType} FOR SUPPLY AND INSTALLATION
          </h2>

          {/* EXACT GREETING */}
          <div style={{ marginBottom: 30 }}>
            <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>To: {clientName}</p>
            <p style={{ fontSize: 12, margin: '10px 0' }}>Dear Sir/Madam,</p>
            <p style={{ fontSize: 11, margin: 0, lineHeight: 1.5 }}>
              We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.
            </p>
          </div>

          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', marginBottom: 30 }}>
            <thead>
              <tr style={{ borderTop: '2px solid #0D2B4E', borderBottom: '2px solid #0D2B4E', color: '#0D2B4E' }}>
                <th style={{ textAlign: 'left', padding: '8px 4px' }}>DESCRIPTION</th>
                <th style={{ textAlign: 'right', padding: '8px 4px' }}>QTY</th>
                <th style={{ textAlign: 'right', padding: '8px 4px' }}>VAT</th>
                <th style={{ textAlign: 'right', padding: '8px 4px' }}>UNIT PRICE</th>
                <th style={{ textAlign: 'right', padding: '8px 4px' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 4px' }}>{item.name}</td>
                  <td style={{ textAlign: 'right', padding: '8px 4px' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px 4px' }}>0%</td>
                  <td style={{ textAlign: 'right', padding: '8px 4px' }}>{item.price.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '8px 4px' }}>{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
            <div style={{ width: 250 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>Subtotal</span><span>{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>VAT (16%)</span><span>{vat.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 900, borderTop: '2px solid #0D2B4E', paddingTop: 8, color: '#0D2B4E' }}>
                <span>Total KES</span><span>{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 3-IMAGE STRIP - ONLY SHOWS IF PRODUCTS HAVE IMAGES */}
          {displayImages.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30, padding: '10px 0', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1' }}>
              {displayImages.map((img, idx) => (
                  <img key={idx} src={img} alt="" style={{ height: 80, objectFit: 'contain', maxWidth: '30%' }} />
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 15, marginBottom: 20 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#0D2B4E' }}>TERMS & CONDITIONS:</h4>
            <p style={{ fontSize: 9, color: '#64748b', margin: '2px 0' }}>Delivery: EX STOCK SUBJECT TO PRIOR SALES.</p>
            <p style={{ fontSize: 9, color: '#64748b', margin: '2px 0' }}>Validity: THIS PRICE VALID FOR 1 WEEK.</p>
            <p style={{ fontSize: 9, color: '#64748b', margin: '2px 0' }}>Payment: IN FULL PRIOR TO SUPPLY.</p>
          </div>

          {/* PAYMENT OPTIONS - ICONS ABOVE TEXT */}
          <div style={{ border: '1px solid #0D2B4E', borderRadius: '8px', padding: '12px', backgroundColor: '#FFFFFF' }}>
            <h4 style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', color: '#0D2B4E', textTransform: 'uppercase', letterSpacing: '1px' }}>
              PAYMENT OPTIONS
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <img src="/payment-logos/kcb-mobile.png" alt="KCB" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.4', color: '#333' }}>
                  <strong style={{ display: 'block', fontSize: '10px', marginBottom: '2px', color: '#0D2B4E' }}>KINGDOM BANK</strong>
                  Name: Infield Engineering Company<br/>
                  Acc No: 5021964795002<br/>
                  Bank Code: 01103043639002
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <img src="/payment-logos/co-operative-bank.png" alt="Co-op" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.4', color: '#333' }}>
                  <strong style={{ display: 'block', fontSize: '10px', marginBottom: '2px', color: '#0D2B4E' }}>CO-OPERATIVE BANK</strong>
                  Business Name: 1170535<br/>
                  Acc No: 400200
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <img src="/payment-logos/mpesa.png" alt="M-PESA" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.4', color: '#333' }}>
                  <strong style={{ display: 'block', fontSize: '10px', marginBottom: '2px', color: '#0D2B4E' }}>M-PESA</strong>
                  Paybill: 247247<br/>
                  Acc: 0701243548
                </div>
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingBottom: 20 }}>
            <div>
              <div style={{ borderBottom: '1px solid #0D2B4E', width: 120, marginBottom: 6 }}></div>
              <p style={{ fontSize: 9, margin: 0 }}>Name</p>
              <div style={{ borderBottom: '1px solid #0D2B4E', width: 120, marginTop: 16, marginBottom: 6 }}></div>
              <p style={{ fontSize: 9, margin: 0 }}>Date</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'cursive', fontSize: 20, margin: '0 0 6px 0', color: '#0D2B4E' }}>Alphonce Juma</p>
              <div style={{ borderTop: '1px solid #0D2B4E', width: 150, paddingTop: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 700, margin: 0 }}>Authorized Signatory</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}