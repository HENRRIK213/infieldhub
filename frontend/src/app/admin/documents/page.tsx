'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'POSTER'>('BUSINESS');
  
  const [type, setType] = useState('QUOTATION');
  const [title, setTitle] = useState('QUOTATION FOR SUPPLY AND INSTALLATION');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([
    { description: 'DAYLIFF ULTRAVERTER 3KW 24V MULTIFUNCTION INVERTER', qty: 1, vat: 10, price: 36180 },
    { description: 'DAYLIFF DLP 2.6KWH 100AH 24V LITHIUM ION BATTERY', qty: 6, vat: 10, price: 50000 },
  ]);

  const [posterTitle, setPosterTitle] = useState('Power Your Home\nSmart Way');
  const [posterSub, setPosterSub] = useState('Clean Solar Energy • Zero Noise • Zero Stress');
  const [posterImage, setPosterImage] = useState('https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1000');
  const [posterTheme, setPosterTheme] = useState('#0ea5e9');
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

  const handlePrint = () => window.print();

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
      alert('Failed to save');
    }
  };

  return (
    <Layout requireAdmin>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('BUSINESS')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'BUSINESS' ? '#1E88E5' : '#fff', color: activeTab === 'BUSINESS' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Estimates / Quotes</button>
        <button onClick={() => setActiveTab('POSTER')} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 700, background: activeTab === 'POSTER' ? '#1E88E5' : '#fff', color: activeTab === 'POSTER' ? '#fff' : '#0D2B4E', border: '1px solid #1E88E5', cursor: 'pointer' }}>Poster Generator</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="no-print" style={{ background: '#fff', padding: 24, borderRadius: 16, maxHeight: '80vh', overflowY: 'auto' }}>
          {activeTab === 'BUSINESS' ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Generate Document</h2>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select value={type} onChange={e => { setType(e.target.value); setTitle(e.target.value === 'QUOTATION' ? 'QUOTATION FOR SUPPLY AND INSTALLATION' : e.target.value === 'INVOICE' ? 'TAX INVOICE' : 'REPORT'); }} style={{ padding: 10, borderRadius: 8, flex: 1 }}>
                  <option value="QUOTATION">Quotation</option>
                  <option value="INVOICE">Invoice</option>
                  <option value="REPORT">Report</option>
                </select>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{ padding: 10, borderRadius: 8, flex: 2 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" style={{ padding: 10, borderRadius: 8, flex: 1 }} />
                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Client Phone" style={{ padding: 10, borderRadius: 8, flex: 1 }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Line Items</h3>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" style={{ padding: 8, borderRadius: 4, flex: 2 }} />
                  <input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} placeholder="Qty" style={{ padding: 8, borderRadius: 4, width: 60 }} />
                  <input type="number" value={item.vat} onChange={e => updateItem(idx, 'vat', Number(e.target.value))} placeholder="VAT" style={{ padding: 8, borderRadius: 4, width: 60 }} />
                  <input type="number" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} placeholder="Price" style={{ padding: 8, borderRadius: 4, width: 100 }} />
                  <button onClick={() => removeItem(idx)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0 10px' }}>X</button>
                </div>
              ))}
              <button onClick={addItem} style={{ background: '#e2e8f0', padding: '8px 16px', borderRadius: 4, border: 'none', fontWeight: 600, marginTop: 10 }}>+ Add Item</button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Poster Generator</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Headline</label>
                <textarea value={posterTitle} onChange={e => setPosterTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, minHeight: 60 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Subheadline</label>
                <input value={posterSub} onChange={e => setPosterSub(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700 }}>Image URL</label>
                <input value={posterImage} onChange={e => setPosterImage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Theme Color</label>
                  <input type="color" value={posterTheme} onChange={e => setPosterTheme(e.target.value)} style={{ width: '100%', height: 40, padding: 2 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Font</label>
                  <select value={posterFont} onChange={e => setPosterFont(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }}>
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier">Courier</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>
            </>
          )}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
            <button onClick={handleSave} style={{ flex: 1, background: '#1E88E5', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save & Notify</button>
            <button onClick={handlePrint} style={{ flex: 1, background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Download PDF</button>
          </div>
        </div>

        <div id="print-area" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'BUSINESS' ? (
            <div style={{ padding: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <img src="/logo.png" alt="InfieldHub" style={{ height: 60, objectFit: "contain" }} />
                  <div style={{ fontSize: 12, color: '#64748b' }}>P.O BOX 62700-19052, Meru Township</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>0701243548</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{new Date().toLocaleDateString()}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Serial: {type.slice(0,2)}-{Date.now().toString().slice(-6)}</div>
                </div>
              </div>
              <h1 style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', margin: '24px 0', textDecoration: 'underline' }}>{title}</h1>
              <div style={{ marginBottom: 20, fontSize: 13 }}>
                <strong>To: {clientName || 'THE CLIENT'}</strong><br/>
                {clientPhone && <span>{clientPhone}</span>}<br/>
                Dear Sir/Madam,<br/><br/>
                We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 20 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0D2B4E', textAlign: 'left' }}>
                    <th style={{ padding: 8 }}>DESCRIPTION</th>
                    <th style={{ padding: 8, width: 50 }}>QTY</th>
                    <th style={{ padding: 8, width: 50 }}>VAT</th>
                    <th style={{ padding: 8, width: 100, textAlign: 'right' }}>UNIT PRICE</th>
                    <th style={{ padding: 8, width: 100, textAlign: 'right' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: 8 }}>{item.description}</td>
                      <td style={{ padding: 8 }}>{item.qty}</td>
                      <td style={{ padding: 8 }}>{item.vat}%</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{item.price.toLocaleString()}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, fontSize: 13 }}>
                <div>Subtotal: KES {subtotal.toLocaleString()}</div>
                <div>VAT: KES {vatTotal.toLocaleString()}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#0D2B4E', borderTop: '1px solid #0D2B4E', paddingTop: 4 }}>TOTAL: KES {grandTotal.toLocaleString()}</div>
              </div>
              <div style={{ marginTop: 40, fontSize: 12 }}>
                <p>Validity 15 days from the date of submission.</p>
                <p>Payment Terms: Payment to be made in full.</p>
                <p>Yours faithfully,</p>
                <p style={{ marginTop: 20, fontWeight: 700 }}>Alphone Juma</p>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: 600, position: 'relative', background: `url(${posterImage}) center/cover`, fontFamily: posterFont }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${posterTheme}dd 0%, ${posterTheme}00 50%, ${posterTheme}dd 100%)` }} />
              <div style={{ position: 'absolute', inset: 0, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#fff' }}>
                <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.5)', whiteSpace: 'pre-line' }}>{posterTitle}</h1>
                <p style={{ fontSize: 24, fontWeight: 600, marginTop: 20, textShadow: '0 2px 6px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.3)', padding: '10px 20px', borderRadius: 8 }}>{posterSub}</p>
                <div style={{ marginTop: 40, background: '#fff', color: posterTheme, padding: '12px 30px', borderRadius: 999, fontSize: 24, fontWeight: 800 }}>Contact Us Today</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

