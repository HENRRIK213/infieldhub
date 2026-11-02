'use client';
import Layout from '@/components/Layout';
import { api, getImageSrc } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'POSTER'>('BUSINESS');
  const [type, setType] = useState('QUOTATION');
  const [clientName, setClientName] = useState('THE CLIENT');
  const [documentRef, setDocumentRef] = useState('');
  const [reportSubject, setReportSubject] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [reportWork, setReportWork] = useState('');
  const [reportRecommendations, setReportRecommendations] = useState('');
  const [pdfStatus, setPdfStatus] = useState('');
  
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [adProducts, setAdProducts] = useState<any[]>([]);
  const [featuredImagesLoading, setFeaturedImagesLoading] = useState(true);
  const [featuredImagesError, setFeaturedImagesError] = useState('');
  
  const [posterTitle, setPosterTitle] = useState('Power Your Home\nThe Smart Way');
  const [posterSub, setPosterSub] = useState('Clean Solar Energy • Zero Noise • Zero Stress');
  const [posterImage, setPosterImage] = useState('https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1000');
  const [posterTheme, setPosterTheme] = useState('#10b981');
  const [posterFont, setPosterFont] = useState('Inter');
  
  const [paperSize, setPaperSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prefix = type === 'QUOTATION' ? 'QT' : type === 'INVOICE' ? 'INV' : 'RPT';
    setDocumentRef(`${prefix}-${Date.now().toString().slice(-8)}`);
  }, [type]);

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data);
      const withImages = r.data.filter((p: any) => p.imageUrl);
      for (let i = withImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [withImages[i], withImages[j]] = [withImages[j], withImages[i]];
      }
      setAdProducts(
        withImages.slice(0, 3)
      );
    }).catch((error) => {
      console.error('Failed to load featured product images:', error);
      setAdProducts([]);
      setFeaturedImagesError('Featured product images could not be loaded. Check the backend connection.');
    }).finally(() => {
      setFeaturedImagesLoading(false);
    });
  }, []);

  const addItem = (prod: any) => {
    setSelectedItems([...selectedItems, { ...prod, qty: 1 }]);
  };
  const updateQty = (index: number, qty: number) => {
    const newItems = [...selectedItems];
    newItems[index].qty = Math.max(1, Math.floor(qty) || 1);
    setSelectedItems(newItems);
  };
  const removeItem = (index: number) => setSelectedItems(selectedItems.filter((_, i) => i !== index));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const subtotal = selectedItems.reduce((s, i) => s + (i.qty * i.price), 0);
  const vatTotal = selectedItems.reduce((s, i) => s + (i.vat ? (i.qty * i.price * 0.16) : 0), 0);
  const grandTotal = subtotal + vatTotal;

  const handleDownloadPDF = async () => {
    if (activeTab === 'BUSINESS' && type === 'REPORT' && !reportSubject.trim()) {
      setPdfStatus('Enter a report subject before downloading.');
      return;
    }
    if (activeTab === 'BUSINESS' && type !== 'REPORT' && selectedItems.length === 0) {
      setPdfStatus(`Add at least one product before downloading this ${type.toLowerCase()}.`);
      return;
    }
    setIsGenerating(true);
    setPdfStatus('');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('print-area');
      if (!element) throw new Error('Document preview is unavailable');
      const formatMap: any = { 'A4': 'a4', 'A3': 'a3', 'A5': 'a5', 'Letter': 'letter', 'Square': [8, 8] };
      await document.fonts.ready;
      await Promise.all(Array.from(element.querySelectorAll('img')).map((image) => image.decode()));

      const opt: any = {
        margin: 0,
        filename: `${activeTab === 'BUSINESS' ? type : 'Poster'}-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: formatMap[paperSize] || 'a4', orientation: activeTab === 'BUSINESS' ? 'portrait' : orientation },
        pagebreak: { mode: ['css'], avoid: ['tr', 'img', '.quote-terms', '.quote-payment'] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      setPdfStatus(error instanceof Error ? `PDF download failed: ${error.message}` : 'PDF download failed. Please try again.');
      setIsGenerating(false);
      return;
    }

    try {
      const savedItems = selectedItems.map(({ id, name, price, vat, qty }) => ({ id, name, price, vat, qty }));
      await api.post('/documents', {
        type: activeTab === 'BUSINESS' ? type : 'POSTER',
        title: activeTab === 'BUSINESS' ? `${type} for ${clientName}` : posterTitle,
        clientName,
        content: activeTab === 'BUSINESS'
          ? {
              documentRef,
              items: savedItems,
              featuredProductIds: type === 'QUOTATION' ? adProducts.map((product) => product.id) : [],
              reportSubject,
              reportSummary,
              reportWork,
              reportRecommendations,
            }
          : { posterTitle, posterSub, posterTheme, paperSize, orientation },
        total: activeTab === 'BUSINESS' && type !== 'REPORT' ? grandTotal : 0,
      });
      setPdfStatus('PDF downloaded and saved to document history.');
    } catch (error) {
      setPdfStatus('PDF downloaded, but it could not be saved to document history. Check the backend connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const logoSrc = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';
  const previewDimensions = { 'A4': { width: '210mm', height: '297mm' }, 'A3': { width: '297mm', height: '420mm' }, 'A5': { width: '148mm', height: '210mm' }, 'Letter': { width: '8.5in', height: '11in' }, 'Square': { width: '8in', height: '8in' } }[paperSize] || { width: '210mm', height: '297mm' };
  const isLandscape = orientation === 'landscape' && paperSize !== 'Square';
  const finalWidth = isLandscape ? previewDimensions.height : previewDimensions.width;
  const finalHeight = isLandscape ? previewDimensions.width : previewDimensions.height;
  const reportFields: { label: string; value: string; setValue: (value: string) => void; placeholder: string }[] = [
    { label: 'Report Subject', value: reportSubject, setValue: setReportSubject, placeholder: 'Example: Solar pump installation inspection' },
    { label: 'Executive Summary', value: reportSummary, setValue: setReportSummary, placeholder: 'Summarize the purpose and outcome of the visit.' },
    { label: 'Work Completed / Findings', value: reportWork, setValue: setReportWork, placeholder: 'Record the work performed, measurements, and findings.' },
    { label: 'Recommendations / Next Steps', value: reportRecommendations, setValue: setReportRecommendations, placeholder: 'List the recommended actions and follow-up.' },
  ];

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

              {type === 'REPORT' ? (
                <>
                  {reportFields.map(({ label, value, setValue, placeholder }) => (
                    <label key={label} style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                      {label}
                      <textarea
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder={placeholder}
                        style={{ display: 'block', width: '100%', minHeight: 72, resize: 'vertical', marginTop: 6, padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, font: 'inherit', fontWeight: 400 }}
                      />
                    </label>
                  ))}
                </>
              ) : (
                <>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Add Product</label>
                  <select onChange={e => { const p = products.find(x => x.id === e.target.value); if (p) addItem(p); e.target.value = ''; }} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 16 }}>
                    <option value="">-- Select a product --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - KSH {p.price.toLocaleString()}</option>)}
                  </select>

                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Selected Items</h3>
                  {selectedItems.length === 0 && <div style={{ color: '#94a3b8', fontSize: 12 }}>No items selected</div>}
                  {selectedItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, background: '#f8fafc', padding: 8, borderRadius: 6 }}>
                      <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{item.name}</div>
                      <input type="number" min="1" step="1" value={item.qty} onChange={e => updateQty(idx, Number(e.target.value))} style={{ width: 50, padding: 4, border: '1px solid #cbd5e1', borderRadius: 4 }} />
                      <button onClick={() => removeItem(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>Remove</button>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Poster Designer</h2>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Headline</label>
              <textarea value={posterTitle} onChange={e => setPosterTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, minHeight: 60, border: '1px solid #cbd5e1', marginBottom: 16, fontFamily: posterFont }} />
              
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Subheadline</label>
              <input value={posterSub} onChange={e => setPosterSub(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 16, fontFamily: posterFont }} />
              
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Background Image</label>
              <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginBottom: 16, transition: 'all 0.2s' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📸</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E88E5' }}>Click to Upload Image</div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Theme Color</label>
                  <input type="color" value={posterTheme} onChange={e => setPosterTheme(e.target.value)} style={{ width: '100%', height: 40, padding: 2, border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: 'block' }}>Font Style</label>
                  <select value={posterFont} onChange={e => setPosterFont(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, display: 'block' }}>Print Settings</label>
                <select value={paperSize} onChange={e => setPaperSize(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 8 }}>
                  <option value="A4">A4 (Standard)</option>
                  <option value="A3">A3 (Large Poster)</option>
                  <option value="Square">Square (Social Media)</option>
                </select>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setOrientation('portrait')} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', background: orientation === 'portrait' ? '#1E88E5' : '#fff', color: orientation === 'portrait' ? '#fff' : '#0D2B4E', fontWeight: 600 }}>Portrait</button>
                  <button onClick={() => setOrientation('landscape')} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', background: orientation === 'landscape' ? '#1E88E5' : '#fff', color: orientation === 'landscape' ? '#fff' : '#0D2B4E', fontWeight: 600 }}>Landscape</button>
                </div>
              </div>
            </>
          )}

          <button onClick={handleDownloadPDF} disabled={isGenerating} style={{ width: '100%', background: '#0D2B4E', color: '#fff', padding: 14, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            {isGenerating ? 'Generating...' : '⬇ Download PDF'}
          </button>
          {type === 'QUOTATION' && !featuredImagesLoading && (
            <p role={featuredImagesError || adProducts.length < 3 ? 'alert' : 'status'} style={{ color: featuredImagesError || adProducts.length < 3 ? '#b45309' : '#166534', fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
              {featuredImagesError || (adProducts.length < 3
                ? `Only ${adProducts.length} approved products have images. Add images to at least 3 products to feature three unique products on quotations.`
                : 'Three unique product images are ready for this quotation.')}
            </p>
          )}
          {pdfStatus && <p role="status" style={{ color: pdfStatus.startsWith('PDF downloaded') ? '#166534' : '#b91c1c', fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>{pdfStatus}</p>}
        </div>

        {/* RIGHT: Preview */}
        <div style={{ background: '#e2e8f0', padding: 20, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'auto' }}>
          
          <div id="print-area" style={{ background: activeTab === 'POSTER' ? `url(${posterImage}) center/cover` : '#fff', width: activeTab === 'POSTER' ? finalWidth : '210mm', height: activeTab === 'POSTER' ? finalHeight : 'auto', minHeight: activeTab === 'POSTER' ? finalHeight : '297mm', padding: activeTab === 'POSTER' ? 0 : 40, margin: '0 auto', flexShrink: 0, boxSizing: 'border-box', fontFamily: activeTab === 'POSTER' ? posterFont : 'Arial, sans-serif', fontSize: 11, color: '#000', position: 'relative', overflow: activeTab === 'POSTER' ? 'hidden' : 'visible', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            
            {activeTab === 'BUSINESS' ? (
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <img src={logoSrc} alt="Logo" style={{ height: 60 }} crossOrigin="anonymous" />
                      <div style={{ marginTop: 10, fontSize: 10, color: '#475569', lineHeight: 1.4 }}>
                        <strong style={{ color: '#0D2B4E', fontSize: 12 }}>InfieldHub Engineering</strong><br/>
                        P.O BOX 62700-19052<br/>
                        Meru Township<br/>
                        Tel: 0701243548
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 180 }}>
                      <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
                        Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong><br/>
                        Ref: <strong>{documentRef || 'Preparing...'}</strong>
                      </div>
                      <img src="/payment-logos/quotation-solar-panels.png" alt="Solar panels" style={{ width: 132, height: 78, objectFit: 'contain', marginTop: 6 }} />
                    </div>
                  </div>

                  <h1 style={{ width: '100%', textAlign: 'center', fontSize: 22, lineHeight: 1.2, fontWeight: 800, color: '#0D2B4E', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.04em', overflowWrap: 'anywhere' }}>
                    {type === 'REPORT' ? 'SERVICE REPORT' : type}
                  </h1>

                  {/* Divider */}
                  <div style={{ borderBottom: '2px solid #0D2B4E', marginBottom: 16 }}></div>

                  {/* Client Info */}
                  <div style={{ marginBottom: 24, fontSize: 12, lineHeight: 1.6 }}>
                    <strong>To: {clientName || 'THE CLIENT'}</strong><br/>
                    Dear Sir/Madam,<br/>
                    <span style={{ display: 'inline-block', marginTop: 8 }}>
                      {type === 'QUOTATION'
                        ? 'We are pleased to submit our quotation for the products and services listed below.'
                        : type === 'INVOICE'
                          ? 'Please find the itemized invoice for the products and services listed below.'
                          : 'Please find below the service report prepared for your reference.'}
                    </span>
                  </div>

                  {type === 'REPORT' ? (
                    <div style={{ fontSize: 11, lineHeight: 1.6, color: '#334155' }}>
                      {[
                        ['REPORT SUBJECT', reportSubject],
                        ['EXECUTIVE SUMMARY', reportSummary],
                        ['WORK COMPLETED / FINDINGS', reportWork],
                        ['RECOMMENDATIONS / NEXT STEPS', reportRecommendations],
                      ].map(([heading, value]) => value.trim() && (
                        <section key={heading} style={{ marginBottom: 18, pageBreakInside: 'avoid' }}>
                          <h2 style={{ color: '#0D2B4E', fontSize: 11, margin: '0 0 6px', borderBottom: '1px solid #D9E2EC', paddingBottom: 4 }}>{heading}</h2>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{value}</p>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, pageBreakInside: 'auto' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderTop: '1px solid #0D2B4E', borderBottom: '1px solid #0D2B4E', textAlign: 'left', color: '#0D2B4E', fontSize: 11 }}>
                        <th style={{ padding: '10px 8px', fontWeight: 800 }}>DESCRIPTION</th>
                        <th style={{ padding: '10px 8px', width: 40, textAlign: 'center', fontWeight: 800 }}>QTY</th>
                        <th style={{ padding: '10px 8px', width: 50, textAlign: 'center', fontWeight: 800 }}>VAT</th>
                        <th style={{ padding: '10px 8px', width: 90, textAlign: 'right', fontWeight: 800 }}>UNIT PRICE</th>
                        <th style={{ padding: '10px 8px', width: 90, textAlign: 'right', fontWeight: 800 }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', fontSize: 11 }}>
                          <td style={{ padding: '10px 8px' }}>{item.name}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.vat ? '16%' : '0%'}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>{Number(item.price).toLocaleString()}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>{(item.qty * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 30 }}>
                    <div style={{ width: 250, fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#475569' }}><span>Subtotal</span> <strong>KES {subtotal.toLocaleString()}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#475569' }}><span>VAT (16%)</span> <strong>KES {vatTotal.toLocaleString()}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #0D2B4E', marginTop: 4, fontSize: 14, color: '#0D2B4E' }}><strong>Total KES</strong> <strong>{grandTotal.toLocaleString()}</strong></div>
                    </div>
                  </div>
                    </>
                  )}
                </div>

                <div>
                  {type === 'QUOTATION' && (
                    <section style={{ margin: '0 0 18px', pageBreakInside: 'avoid' }}>
                      <div style={{ color: '#0D2B4E', fontSize: 11, fontWeight: 800, marginBottom: 8 }}>FEATURED PRODUCTS</div>
                      {adProducts.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                          {adProducts.map((product: any, index: number) => (
                            <div key={`${product.id}-${index}`} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 8, textAlign: 'center', pageBreakInside: 'avoid' }}>
                              <img src={getImageSrc(product.imageUrl)} alt={product.name} style={{ width: '100%', height: 76, objectFit: 'contain' }} />
                              <div style={{ color: '#334155', fontSize: 9, marginTop: 4 }}>{product.name}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#64748b', fontSize: 9 }}>Add product images in Product Manager to feature them here.</div>
                      )}
                    </section>
                  )}

                  {type === 'QUOTATION' && (
                    <div className="quote-terms" style={{ borderTop: '1px solid #0D2B4E', paddingTop: 12, fontSize: 10, color: '#475569', marginBottom: 16, lineHeight: 1.5, pageBreakInside: 'avoid' }}>
                      <strong style={{ color: '#0D2B4E', fontSize: 11 }}>TERMS & CONDITIONS:</strong><br/>
                      Delivery: EX STOCK SUBJECT TO PRIOR SALES.<br/>
                      Validity: THIS PRICE VALID FOR 1 WEEK.<br/>
                      Payment: IN FULL PRIOR TO SUPPLY.
                    </div>
                  )}
                  {type === 'INVOICE' && (
                    <div style={{ borderTop: '1px solid #0D2B4E', paddingTop: 12, fontSize: 10, color: '#475569', marginBottom: 16, lineHeight: 1.5, pageBreakInside: 'avoid' }}>
                      <strong style={{ color: '#0D2B4E', fontSize: 11 }}>PAYMENT TERMS</strong><br/>
                      Payment is due upon receipt of this invoice. Please use the invoice reference when making payment.
                    </div>
                  )}

                  {/* Payment Options */}
                  {type === 'QUOTATION' && (
                    <div className="quote-payment" style={{ border: '1px solid #0D2B4E', borderRadius: 8, padding: 12, marginBottom: 24, pageBreakInside: 'avoid' }}>
                      <div style={{ fontWeight: 800, marginBottom: 10, textAlign: 'center', fontSize: 11, background: '#F8FAFC', padding: 6, color: '#0D2B4E' }}>PAYMENT OPTIONS</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, fontSize: 9, color: '#475569' }}>
                        <div>
                          <img src="/payment-logos/kcb-mobile.png" alt="Kingdom Bank KCB Mobile" style={{ width: '100%', height: 42, objectFit: 'contain', marginBottom: 8 }} />
                          <strong style={{ color: '#0D2B4E' }}>KINGDOM BANK</strong><br/>
                          Name: InfieldHub Ltd<br/>
                          Acc No: 5021964795002<br/>
                          Bank Code: 01103043639002
                        </div>
                        <div>
                          <img src="/payment-logos/co-operative-bank.png" alt="Co-operative Bank" style={{ width: '100%', height: 42, objectFit: 'contain', marginBottom: 8 }} />
                          <strong style={{ color: '#0D2B4E' }}>CO-OPERATIVE BANK (CoopTill)</strong><br/>
                          Business Name: 1170535<br/>
                          Acc No: 400200
                        </div>
                        <div>
                          <img src="/payment-logos/mpesa.png" alt="M-PESA Paybill" style={{ width: '100%', height: 42, objectFit: 'contain', marginBottom: 8 }} />
                          <strong style={{ color: '#0D2B4E' }}>M-PESA</strong><br/>
                          Paybill: 247247<br/>
                          Acc: 0701243548
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Signatures */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingBottom: 20 }}>
                    <div style={{ fontSize: 10, color: '#475569' }}>
                      Name _______________________<br/><br/><br/>
                      Date _______________________
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: 20, color: '#0D2B4E' }}>Alphonce Juma</div>
                      <div style={{ borderTop: '1px solid #0D2B4E', paddingTop: 4, marginTop: 4, fontSize: 10, fontWeight: 700, color: '#0D2B4E' }}>Authorized Signatory</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%', position: 'relative', background: `linear-gradient(to bottom, ${posterTheme}dd 0%, ${posterTheme}00 40%, ${posterTheme}00 60%, ${posterTheme}ee 100%)` }}>
                <div style={{ position: 'absolute', inset: 0, padding: isLandscape ? 40 : 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                  <img src={logoSrc} alt="Logo" style={{ height: isLandscape ? 60 : 80, objectFit: 'contain', background: 'white', padding: 10, borderRadius: 10 }} crossOrigin="anonymous" />
                  <div style={{ width: '100%' }}>
                    <h1 style={{ fontSize: isLandscape ? 60 : 80, fontWeight: 900, lineHeight: 1.1, margin: 0, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.6)', whiteSpace: 'pre-line' }}>{posterTitle}</h1>
                    <p style={{ fontSize: isLandscape ? 20 : 26, fontWeight: 700, marginTop: 20, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)', background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: 12, display: 'inline-block' }}>{posterSub}</p>
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
