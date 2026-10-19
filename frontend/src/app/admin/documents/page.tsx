'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'POSTER'>('BUSINESS');
  const [type, setType] = useState('QUOTATION');
  const [clientName, setClientName] = useState('THE CLIENT');
  
  // Business Doc State
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  
  // Poster State
  const [posterTitle, setPosterTitle] = useState('Power Your Home\nThe Smart Way');
  const [posterSub, setPosterSub] = useState('Clean Solar Energy • Zero Noise • Zero Stress');
  const [posterImage, setPosterImage] = useState('https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1000');
  const [posterTheme, setPosterTheme] = useState('#10b981');
  const [posterFont, setPosterFont] = useState('Inter');

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const addItem = (prod: any) => setSelectedItems([...selectedItems, { ...prod, qty: 1 }]);
  const updateQty = (index: number, qty: number) => {
    const newItems = [...selectedItems];
    newItems[index].qty = qty;
    setSelectedItems(newItems);
  };
  const removeItem = (index: number) => setSelectedItems(selectedItems.filter((_, i) => i !== index));

  const subtotal = selectedItems.reduce((s, i) => s + (i.qty * i.price), 0);
  const vatTotal = selectedItems.reduce((s, i) => s + (i.vat ? (i.qty * i.price * 0.16) : 0), 0);
  const grandTotal = subtotal + vatTotal;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('print-area');
      const opt: any = {
        margin: activeTab === 'BUSINESS' ? 0.5 : 0, 
        filename: `${activeTab === 'BUSINESS' ? type : 'Poster'}-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
      
      // Save to database
      await api.post('/documents', {
        type: activeTab === 'BUSINESS' ? type : 'POSTER',
        title: activeTab === 'BUSINESS' ? `${type} for ${clientName}` : posterTitle,
        clientName, content: activeTab === 'BUSINESS' ? selectedItems : { posterTitle, posterSub, posterImage },
        total: activeTab === 'BUSINESS' ? grandTotal : 0
      });
    } catch (err) {
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const logoSrc = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';

  return (
    <Layout requireAdmin>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('BUSINESS')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'BUSINESS' ? '#1E88E5' : '#fff', color: activeTab === 'BUSINESS' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Quotes / Invoices / Reports</button>
        <button onClick={() => setActiveTab('POSTER')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'POSTER' ? '#1E88E5' : '#fff', color: activeTab === 'POSTER' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Poster Generator</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(600px, 2fr)', gap: 20 }}>
        
        {/* LEFT: Builder */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', height: 'fit-content' }}>
          {activeTab === 'BUSINESS' ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Document Builder</h2>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Document Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 16 }}>
                <option value="QUOTATION">Quotation</option>
                <option value="INVOICE">Invoice</option>
                <option value="REPORT">Report</option>
              </select>
              
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Client Name</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 16 }} />

              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Add Product</label>
              <select onChange={e => { const p = products.find(x => x.id === e.target.value); if (p) addItem(p); }} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 16 }}>
                <option value="">-- Select a product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - KSH {p.price.toLocaleString()}</option>)}
              </select>

              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Selected Items</h3>
              {selectedItems.length === 0 && <div style={{ color: '#94a3b8', fontSize: 12 }}>No items selected</div>}
              {selectedItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, background: '#f8fafc', padding: 8, borderRadius: 6 }}>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{item.name}</div>
                  <input type="number" min="1" value={item.qty} onChange={e => updateQty(idx, Number(e.target.value))} style={{ width: 50, padding: 4, border: '1px solid #cbd5e1', borderRadius: 4 }} />
                  <button onClick={() => removeItem(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>X</button>
                </div>
              ))}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Poster Settings</h2>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Headline</label>
              <textarea value={posterTitle} onChange={e => setPosterTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, minHeight: 60, border: '1px solid #cbd5e1', marginBottom: 16 }} />
              
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Subheadline</label>
              <input value={posterSub} onChange={e => setPosterSub(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 16 }} />
              
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Background Image URL</label>
              <input value={posterImage} onChange={e => setPosterImage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 16 }} />
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Theme Color</label>
                  <input type="color" value={posterTheme} onChange={e => setPosterTheme(e.target.value)} style={{ width: '100%', height: 40, padding: 2, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Font</label>
                  <select value={posterFont} onChange={e => setPosterFont(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier">Courier</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button onClick={handleDownloadPDF} disabled={isGenerating} style={{ width: '100%', background: '#0D2B4E', color: '#fff', padding: 14, borderRadius: 8, border: 'none', marginTop: 20, fontWeight: 700, cursor: 'pointer' }}>
            {isGenerating ? 'Generating...' : '⬇ Download PDF'}
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ background: '#e2e8f0', padding: 20, borderRadius: 12, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
          
          <div id="print-area" style={{ 
            background: activeTab === 'POSTER' ? `url(${posterImage}) center/cover` : '#fff',
            width: '210mm', minHeight: '297mm', padding: activeTab === 'POSTER' ? 0 : 40, 
            fontFamily: activeTab === 'POSTER' ? posterFont : 'Arial, sans-serif',
            fontSize: 11, color: '#000', position: 'relative', overflow: 'hidden'
          }}>
            
            {activeTab === 'BUSINESS' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 20 }}>
                  <div>
                    <img src={logoSrc} alt="Logo" style={{ height: 60 }} crossOrigin="anonymous" />
                    <div style={{ marginTop: 10, fontSize: 10 }}>
                      <strong>InfieldHub Engineering</strong><br/>P.O BOX 62700-19052<br/>Meru Township<br/>Tel: 0701243548
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{type}</h1>
                    <div style={{ marginTop: 10, fontSize: 10 }}>
                      Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong><br/>
                      Ref: <strong>INV-{Date.now().toString().slice(-6)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <strong>To: {clientName || 'THE CLIENT'}</strong><br/>
                  Dear Sir/Madam,
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                      <th style={{ padding: 8, textAlign: 'left' }}>DESCRIPTION</th>
                      <th style={{ padding: 8, width: 40, textAlign: 'center' }}>QTY</th>
                      <th style={{ padding: 8, width: 50, textAlign: 'center' }}>VAT</th>
                      <th style={{ padding: 8, width: 90, textAlign: 'right' }}>UNIT PRICE</th>
                      <th style={{ padding: 8, width: 90, textAlign: 'right' }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: 8 }}>{item.name}</td>
                        <td style={{ padding: 8, textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: 8, textAlign: 'center' }}>{item.vat ? '16%' : '0%'}</td>
                        <td style={{ padding: 8, textAlign: 'right' }}>{item.price.toLocaleString()}</td>
                        <td style={{ padding: 8, textAlign: 'right' }}>{(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                  <div style={{ width: 250 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Subtotal</span> <strong>KES {subtotal.toLocaleString()}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>VAT (16%)</span> <strong>KES {vatTotal.toLocaleString()}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #000', marginTop: 4, fontSize: 14 }}><strong>Total KES</strong> <strong>{grandTotal.toLocaleString()}</strong></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #000', paddingTop: 10, fontSize: 10, marginBottom: 20 }}>
                  <strong>TERMS & CONDITIONS:</strong><br/>
                  Delivery: EX STOCK SUBJECT TO PRIOR SALES.<br/>
                  Validity: THIS PRICE VALID FOR 1 WEEK.<br/>
                  Payment: IN FULL PRIOR TO SUPPLY.<br/>
                  Warranty: AS PER THE INFIELDHUB WARRANTY TERMS.
                </div>

                <div style={{ border: '1px solid #000', padding: 10, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>PAYMENT OPTIONS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: 9 }}>
                    <div>
                      <strong>OPTION 1: BANK</strong><br/>
                      Account Name: InfieldHub Ltd<br/>
                      Bank: Equity Bank<br/>
                      Branch: Meru<br/>
                      Account No: 010403363770002
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>OPTION 2: MPESA</strong><br/>
                      Paybill: 247247<br/>
                      Account: 0701243548
                    </div>
                    <div>
                      <strong>OPTION 3: VISA</strong><br/>
                      Click to pay online at infieldhub.vercel.app
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
                  <div>Name _______________________<br/><br/>Date _______________________</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: 16 }}>Alphone Juma</div>
                    <div style={{ borderTop: '1px solid #000', paddingTop: 4, marginTop: 4 }}>Authorized Signatory</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', minHeight: 1000, position: 'relative', background: `linear-gradient(to bottom, ${posterTheme}dd 0%, ${posterTheme}00 40%, ${posterTheme}00 60%, ${posterTheme}ee 100%)` }}>
                <div style={{ position: 'absolute', inset: 0, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                  <img src={logoSrc} alt="Logo" style={{ height: 60, objectFit: 'contain', background: 'white', padding: 10, borderRadius: 10 }} crossOrigin="anonymous" />
                  <div>
                    <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, margin: 0, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.6)', whiteSpace: 'pre-line' }}>{posterTitle}</h1>
                    <p style={{ fontSize: 24, fontWeight: 700, marginTop: 20, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)', background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: 12, display: 'inline-block' }}>{posterSub}</p>
                  </div>
                  <div style={{ background: '#fff', color: posterTheme, padding: '16px 40px', borderRadius: 999, fontSize: 24, fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>Call: 0701243548</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
