'use client';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';

export default function DocumentsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [clientName, setClientName] = useState('THE CLIENT');
  const [documentType, setDocumentType] = useState('Quotation');
  const [loading, setLoading] = useState(false);
  
  const quotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
      setSelectedProductId(''); 
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  const SafeImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
      />
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#e2e8f0] p-4 md:p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: FORM */}
          <div className="w-full lg:w-[380px] bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-fit sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-[#0a1f44] border-b pb-2">Document Settings</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Document Type</label>
              <select value={documentType} onChange={e => setDocumentType(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50">
                <option value="Quotation">Quotation</option>
                <option value="Invoice">Invoice</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Add Product</label>
              <div className="flex gap-2">
                <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50">
                  <option value="">-- Select a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - KES {p.price}</option>
                  ))}
                </select>
                <button onClick={handleAddProduct} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 text-sm transition-colors">
                  Add
                </button>
              </div>
            </div>

            <div className="mb-6 mt-6 border-t pt-4">
              <h3 className="font-bold text-[#0a1f44] mb-3 text-sm">Selected Items</h3>
              {selectedItems.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No items selected.</p>
              ) : (
                <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                      <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                      <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="w-full bg-[#0a1f44] text-white py-3 rounded-lg font-bold hover:bg-[#152a5a] transition-colors shadow-md">
              Download PDF
            </button>
          </div>

          {/* RIGHT SIDE: OFFICIAL A4 QUOTATION PREVIEW */}
          <div className="w-full flex justify-center overflow-x-auto pb-8">
            <div ref={quotationRef} className="bg-white p-12 shadow-2xl w-[794px] min-h-[1123px] text-[13px] font-sans text-gray-800 relative border border-gray-200">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <SafeImage src="/logo.png" alt="inField Logo" className="h-16 mb-4 object-contain" />
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    P.O BOX 62700-19052, Meru Township<br />
                    <span className="text-blue-700 font-bold">0701243548</span>
                  </p>
                </div>
                <div className="text-right">
                  <SafeImage src="/solar-default.png" alt="Solar Array" className="h-24 ml-auto mb-4 object-contain" />
                  <p className="font-bold text-sm text-[#0a1f44]">{new Date().toLocaleDateString('en-GB')}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Serial: QU-2026-1234</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-12">
                <h1 className="text-xl font-extrabold text-[#0a1f44] uppercase tracking-widest inline-block border-b-[3px] border-[#0a1f44] pb-2">
                  {documentType.toUpperCase()} FOR SUPPLY AND INSTALLATION
                </h1>
              </div>

              {/* Client Info */}
              <div className="mb-10">
                <p className="font-bold mb-4 text-sm text-[#0a1f44]">To: {clientName || 'THE CLIENT'}</p>
                <p className="mb-2">Dear Sir/Madam,</p>
                <p className="leading-relaxed text-justify text-gray-600 font-medium">
                  We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.
                </p>
              </div>

              {/* Table */}
              <table className="w-full mb-10 border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-800 text-[#0a1f44] text-left">
                    <th className="py-3 font-bold uppercase text-[11px] w-1/2 tracking-wider">Description</th>
                    <th className="py-3 font-bold uppercase text-[11px] text-center tracking-wider">Qty</th>
                    <th className="py-3 font-bold uppercase text-[11px] text-center tracking-wider">VAT</th>
                    <th className="py-3 font-bold uppercase text-[11px] text-right tracking-wider">Unit Price</th>
                    <th className="py-3 font-bold uppercase text-[11px] text-right tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.length === 0 ? (
                    <tr className="border-b border-gray-100">
                      <td colSpan={5} className="py-8 text-center text-gray-400 italic">No items added to quotation.</td>
                    </tr>
                  ) : (
                    selectedItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-4 font-medium text-gray-700">{item.name}</td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-center">16%</td>
                        <td className="py-4 text-right">{item.price.toLocaleString()}</td>
                        <td className="py-4 text-right font-medium">{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-1/2 md:w-1/3">
                  <div className="flex justify-between py-1 text-gray-600 font-medium">
                    <span className="font-bold text-[11px] uppercase tracking-wider">Subtotal</span>
                    <span>{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-600 font-medium">
                    <span className="font-bold text-[11px] uppercase tracking-wider">VAT (16%)</span>
                    <span>{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-[#0a1f44] mt-2">
                    <span className="font-extrabold text-sm uppercase text-[#0a1f44] tracking-wider">Total KES</span>
                    <span className="font-extrabold text-sm text-[#0a1f44]">{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-12 bg-gray-50 p-4 rounded border border-gray-100">
                <h2 className="font-bold text-[#0a1f44] text-[11px] mb-3 uppercase tracking-widest border-b border-gray-200 pb-1">Terms & Conditions:</h2>
                <div className="text-[10px] text-gray-600 space-y-1 font-medium">
                  <p>Delivery: EX STOCK SUBJECT TO PRIOR SALES.</p>
                  <p>Validity: THIS PRICE VALID FOR 1 WEEK.</p>
                  <p>Payment: IN FULL PRIOR TO SUPPLY.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-300">
                <div className="border border-gray-400 rounded-lg p-5 w-2/3 mr-4 bg-white">
                  <h3 className="text-center font-bold text-[10px] uppercase mb-4 text-[#0a1f44] tracking-widest">Payment Options</h3>
                  <div className="flex justify-between text-[9px] text-center leading-tight text-gray-700">
                    <div className="w-1/3 px-1 flex flex-col items-center">
                      <SafeImage src="/payment-logos/kcb-mobile.png" alt="Kingdom Bank" className="h-8 mb-2 object-contain" />
                      <p className="font-bold text-[#0a1f44] mb-1">Kingdom Bank</p>
                      <p>Name: Infield Eng. Co.</p>
                      <p>Acc: 5021964795002</p>
                      <p>Code: 01103043839002</p>
                    </div>
                    <div className="w-1/3 px-1 border-x border-gray-200 flex flex-col items-center">
                      <SafeImage src="/payment-logos/co-operative_bank.png" alt="Co-operative Bank" className="h-8 mb-2 object-contain" />
                      <p className="font-bold text-[#0a1f44] mb-1">Co-operative Bank</p>
                      <p>Business: 1170535</p>
                      <p>Acc No: 400200</p>
                    </div>
                    <div className="w-1/3 px-1 flex flex-col items-center">
                      <SafeImage src="/payment-logos/mpesa.png" alt="M-PESA" className="h-8 mb-2 object-contain" />
                      <p className="font-bold text-[#0a1f44] mb-1">M-Pesa</p>
                      <p>Paybill: 247247</p>
                      <p>Acc: 0701243548</p>
                    </div>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col items-end pl-4">
                  <div className="w-full border-b-2 border-gray-400 mb-1 h-8"></div>
                  <p className="text-[9px] text-gray-500 mb-6 uppercase tracking-widest font-bold">Name</p>
                  <div className="w-full border-b-2 border-gray-400 mb-1 h-8"></div>
                  <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Date</p>
                  <p className="font-serif text-2xl text-[#0a1f44] italic mt-3">Alphonce Juma</p>
                  <p className="text-[9px] font-bold uppercase mt-1 text-gray-500 tracking-widest">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
