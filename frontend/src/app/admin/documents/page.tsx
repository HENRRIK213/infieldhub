'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'POSTER'>('BUSINESS');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Business Document State
  const [type, setType] = useState('QUOTATION');
  const [title, setTitle] = useState('QUOTATION FOR SUPPLY AND INSTALLATION');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([
    { description: 'DAYLIFF ULTRAVERTER 3KW 24V MULTIFUNCTION INVERTER', qty: 1, vat: 10, price: 36180 },
    { description: 'DAYLIFF DLP 2.6KWH 100AH 24V LITHIUM ION BATTERY', qty: 6, vat: 10, price: 50000 },
    { description: 'WELDING CABLE 50MM', qty: 6, vat: 16, price: 1577 },
    { description: 'LABOUR CHARGES', qty: 1, vat: 16, price: 35000 },
  ]);

  // Poster State
  const [posterTitle, setPosterTitle] = useState('Power Your Home\nThe Smart Way');
  const [posterSub, setPosterSub] = useState('Clean Solar Energy • Zero Noise • Zero Stress');
  const [posterImage, setPosterImage] = useState('https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1000');
  const [posterTheme, setPosterTheme] = useState('#10b981');
  const [posterFont, setPosterFont] = useState('Inter');

  const addItem = () => setItems([...items, { description: '', qty: 1, vat: 16, price: 0 }]);
  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    setItems(newItems);
  };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, i) => s + (i.qty * i.price), 0);
  const vatTotal = items.reduce((s, i) => s + ((i.qty * i.price) * (i.vat / 100)), 0);
  const grandTotal = subtotal + vatTotal;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('print-area');
      const opt = {
        margin:       activeTab === 'BUSINESS' ? 0.5 : 0,
        filename:     `${activeTab === 'BUSINESS' ? type : 'Poster'}-${Date.now()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/documents', {
        type: activeTab === 'BUSINESS' ? type : 'POSTER', 
        title: activeTab === 'BUSINESS' ? title : posterTitle,
        clientName, clientPhone,
        content: activeTab === 'BUSINESS' ? items : { posterTitle, posterSub, posterImage, posterTheme, posterFont }, 
        total: activeTab === 'BUSINESS' ? grandTotal : 0
      });
      alert('Saved & Notified Admin via SMS/Email!');
    } catch (e) {
      alert('Failed to save document to database.');
    }
  };

  const logoSrc = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';

  return (
    <Layout requireAdmin>
      <style>{`
        .document-paper {
          background: #fff;
          width: 100%;
          max-width: 800px;
          min-height: 1000px;
          margin: 0 auto;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('BUSINESS')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'BUSINESS' ? '#1E88E5' : '#fff', color: activeTab === 'BUSINESS' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Quotes / Invoices</button>
        <button onClick={() => setActiveTab('POSTER')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'POSTER' ? '#1E88E5' : '#fff', color: activeTab === 'POSTER' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Poster Generator</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(600px, 2fr)', gap: 30 }}>
        
        {/* LEFT PANEL: Controls */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 16, height: 'fit-content', border: '1px solid #e2e8f0' }}>
          {activeTab === 'BUSINESS' ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#0D2B4E' }}>Document Details</h2>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select value={type} onChange={e => { setType(e.target.value); setTitle(e.target.value === 'QUOTATION' ? 'QUOTATION FOR SUPPLY AND INSTALLATION' : e.target.value === 'INVOICE' ? 'TAX INVOICE' : 'PROJECT REPORT'); }} style={{ padding: 10, borderRadius: 8, flex: 1, border: '1px solid #cbd5e1' }}>
                  <option value="QUOTATION">Quotation</option>
                  <option value="INVOICE">Invoice</option>
                  <option value="REPORT">Report</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" style={{ padding: 10, borderRadius: 8, flex: 1, border: '1px solid #cbd5e1' }} />
                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Client Phone" style={{ padding: 10, borderRadius: 8, flex: 1, border: '1px solid #cbd5e1' }} />
              </div>
              
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Line Items</h3>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 60px 80px 30px', gap: 6, marginBottom: 8 }}>
                  <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Item" style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }} />
                  <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} placeholder="Qty" style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }} />
                  <input type="number" value={item.vat} onChange={e => updateItem(idx, 'vat', Number(e.target.value))} placeholder="VAT%" style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }} />
                  <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} placeholder="Price" style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }} />
                  <button onClick={() => removeItem(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, fontWeight: 'bold' }}>X</button>
                </div>
              ))}
              <button onClick={addItem} style={{ background: '#f1f5f9', width: '100%', padding: '10px 0', borderRadius: 6, border: 'none', fontWeight: 700, marginTop: 10, cursor: 'pointer' }}>+ Add Item</button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#0D2B4E' }}>Poster Settings</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Headline</label>
                <textarea value={posterTitle} onChange={e => setPosterTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, minHeight: 60, border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Subheadline</label>
                <input value={posterSub} onChange={e => setPosterSub(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Background Image URL</label>
                <input value={posterImage} onChange={e => setPosterImage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Theme Color</label>
                  <input type="color" value={posterTheme} onChange={e => setPosterTheme(e.target.value)} style={{ width: '100%', height: 40, padding: 2, border: '1px solid #cbd5e1', borderRadius: 8 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Font</label>
                  <select value={posterFont} onChange={e => setPosterFont(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}>
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier">Courier</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleDownloadPDF} disabled={isGenerating} style={{ background: '#0D2B4E', color: '#fff', padding: '14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14 }}>
              {isGenerating ? 'Generating PDF...' : '⬇ Download PDF'}
            </button>
            <button onClick={handleSave} style={{ background: '#1E88E5', color: '#fff', padding: '14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14 }}>
              Save & Notify Admin
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', background: '#e2e8f0', padding: '40px 20px', borderRadius: 16, overflow: 'auto' }}>
          
          <div id="print-area" className="document-paper" style={{ 
            background: activeTab === 'POSTER' ? `url(${posterImage}) center/cover` : '#fff',
            fontFamily: activeTab === 'POSTER' ? posterFont : 'Inter, sans-serif',
            padding: activeTab === 'POSTER' ? 0 : 50,
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            {activeTab === 'BUSINESS' ? (
              <>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, borderBottom: '2px solid #0D2B4E', paddingBottom: 20 }}>
                  <div>
                    <img src={logoSrc} alt="Infield" style={{ height: 70, objectFit: 'contain', marginBottom: 10 }} crossOrigin="anonymous" />
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>P.O BOX 62700-19052, Meru Township</div>
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>0701243548</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0D2B4E' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Serial: {type.slice(0,2)}-{Date.now().toString().slice(-6)}</div>
                  </div>
                </div>

                {/* TITLE */}
                <h1 style={{ textAlign: 'center', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', margin: '30px 0', color: '#0D2B4E' }}>{title}</h1>

                {/* CLIENT INFO */}
                <div style={{ marginBottom: 30, fontSize: 13, color: '#1e293b', lineHeight: 1.6 }}>
                  <strong>To: {clientName || 'THE CLIENT'}</strong><br/>
                  {clientPhone && <span>{clientPhone}</span>}<br/>
                  <br/>
                  Dear Sir/Madam,<br/><br/>
                  We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.
                </div>

                {/* TABLE */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 30 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: 10, fontWeight: 700 }}>DESCRIPTION</th>
                      <th style={{ padding: 10, fontWeight: 700, width: 50, textAlign: 'center' }}>QTY</th>
                      <th style={{ padding: 10, fontWeight: 700, width: 60, textAlign: 'center' }}>VAT</th>
                      <th style={{ padding: 10, fontWeight: 700, width: 100, textAlign: 'right' }}>UNIT PRICE (KES)</th>
                      <th style={{ padding: 10, fontWeight: 700, width: 100, textAlign: 'right' }}>AMOUNT (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: 10, color: '#1e293b' }}>{item.description || 'Item description'}</td>
                        <td style={{ padding: 10, textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: 10, textAlign: 'center' }}>{item.vat}%</td>
                        <td style={{ padding: 10, textAlign: 'right' }}>{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: 10, textAlign: 'right', fontWeight: 600 }}>{(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TOTALS */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, fontSize: 13, marginBottom: 40 }}>
                  <div style={{ display: 'flex', width: 250, justifyContent: 'space-between' }}><span>Subtotal:</span> <strong>KES {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
                  <div style={{ display: 'flex', width: 250, justifyContent: 'space-between' }}><span>VAT:</span> <strong>KES {vatTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
                  <div style={{ display: 'flex', width: 250, justifyContent: 'space-between', borderTop: '2px solid #0D2B4E', paddingTop: 8, fontSize: 16, fontWeight: 800, color: '#0D2B4E' }}><span>TOTAL:</span> <span>KES {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                </div>

                {/* FOOTER */}
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
                  <p>Validity 15 days from the date of submission.</p>
                  <p>Payment Terms: Payment to be made in full.</p>
                  <p style={{ marginTop: 30 }}>Yours faithfully,</p>
                  <p style={{ fontWeight: 800, color: '#0D2B4E', marginTop: 20 }}>Alphone Juma</p>
                  <p style={{ color: '#94a3b8' }}>Authorized Signature</p>
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

                  <div style={{ background: '#fff', color: posterTheme, padding: '16px 40px', borderRadius: 999, fontSize: 24, fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    Call: 0701243548
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </Layout>
  );
}
