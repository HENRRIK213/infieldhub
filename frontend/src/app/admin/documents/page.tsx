'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function DocumentsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [clientName, setClientName] = useState('THE CLIENT');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const addItem = (prod: any) => {
    setSelectedItems([...selectedItems, { ...prod, qty: 1 }]);
  };

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
        margin: 0.5, filename: `Quotation-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const logoSrc = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';

  return (
    <Layout requireAdmin>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(600px, 2fr)', gap: 20 }}>
        
        {/* LEFT: Builder */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Quotation Builder</h2>
          
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

          <button onClick={handleDownloadPDF} disabled={isGenerating} style={{ width: '100%', background: '#0D2B4E', color: '#fff', padding: 14, borderRadius: 8, border: 'none', marginTop: 20, fontWeight: 700, cursor: 'pointer' }}>
            {isGenerating ? 'Generating...' : '⬇ Download PDF'}
          </button>
        </div>

        {/* RIGHT: Preview (Davis Style) */}
        <div style={{ background: '#e2e8f0', padding: 20, borderRadius: 12, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
          <div id="print-area" style={{ background: '#fff', width: '210mm', minHeight: '297mm', padding: 40, fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#000' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 20 }}>
              <div>
                <img src={logoSrc} alt="Logo" style={{ height: 60 }} crossOrigin="anonymous" />
                <div style={{ marginTop: 10, fontSize: 10 }}>
                  <strong>InfieldHub Engineering</strong><br/>
                  P.O BOX 62700-19052<br/>
                  Meru Township<br/>
                  Tel: 0701243548<br/>
                  info@infieldhub.com
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Sales Quote</h1>
                <div style={{ marginTop: 10, fontSize: 10 }}>
                  Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong><br/>
                  Quote No: <strong>INV-{Date.now().toString().slice(-6)}</strong>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ marginBottom: 20 }}>
              <strong>To: {clientName || 'THE CLIENT'}</strong><br/>
              Dear Sir/Madam,
            </div>

            <p style={{ marginBottom: 20, fontSize: 11 }}>We are pleased to provide the following quotation for your requested items.</p>

            {/* Table */}
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

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <div style={{ width: 250 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Subtotal</span> <strong>KES {subtotal.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>VAT (16%)</span> <strong>KES {vatTotal.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #000', marginTop: 4, fontSize: 14 }}><strong>Total KES</strong> <strong>{grandTotal.toLocaleString()}</strong></div>
              </div>
            </div>

            {/* Terms & Payment */}
            <div style={{ borderTop: '1px solid #000', paddingTop: 10, fontSize: 10, marginBottom: 20 }}>
              <strong>DELIVERY:</strong> EX STOCK SUBJECT TO PRIOR SALES.<br/>
              <strong>VALIDITY:</strong> THIS PRICE VALID FOR 1 WEEK.<br/>
              <strong>PAYMENT:</strong> IN FULL PRIOR TO SUPPLY.<br/>
              <strong>WARRANTY:</strong> AS PER THE INFIELDHUB WARRANTY TERMS.
            </div>

            {/* Payment Options (Matches Davis style) */}
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
                  <div style={{ marginTop: 4, background: '#10b981', color: '#fff', padding: 2, display: 'inline-block', borderRadius: 4 }}>M-PESA</div>
                </div>
                <div>
                  <strong>OPTION 3: VISA</strong><br/>
                  Click to pay online at infieldhub.vercel.app
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
              <div>
                <div>Name _______________________</div>
                <div style={{ marginTop: 10 }}>Date _______________________</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: 16 }}>Alphone Juma</div>
                <div style={{ borderTop: '1px solid #000', paddingTop: 4, marginTop: 4 }}>Authorized Signatory</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
