"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { Download, Loader2, Plus, Trash2, FileText, User, Settings, Package, Image as ImageIcon, Palette } from "lucide-react";

export default function DocumentsPage() {
  const [docType, setDocType] = useState("Quotation");
  const [clientName, setClientName] = useState("THE CLIENT");
  const [items, setItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Poster State
  const [posterTitle, setPosterTitle] = useState("MEGA SALE");
  const [posterSubtitle, setPosterSubtitle] = useState("Up to 50% OFF on all Solar Equipment");
  const [posterCta, setPosterCta] = useState("Call: 0701243548 to Order");
  const [posterImageUrl, setPosterImageUrl] = useState("https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80");
  const [posterBgColor, setPosterBgColor] = useState("#0D2B4E");
  const [posterTextColor, setPosterTextColor] = useState("#FFFFFF");
  const [posterAccentColor, setPosterAccentColor] = useState("#F59E0B");
  
  const posterRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setDbProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    const product = dbProducts.find(p => p.id === selectedProduct);
    if (product) {
      setItems([...items, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        qty: 1, 
        vat: 16 
      }]);
      setSelectedProduct("");
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleDownload = async () => {
    const targetRef = docType === "Poster" ? posterRef : documentRef;
    if (!targetRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(targetRef.current, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: docType === "Poster" ? posterBgColor : "#ffffff",
        windowWidth: docType === "Poster" ? 600 : 794,
        windowHeight: docType === "Poster" ? 848 : 1123
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = docType === "Poster" ? `Poster-${Date.now()}.png` : `Quotation-${Date.now()}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download. Please ensure all images are loading correctly.");
    } finally {
      setIsDownloading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const vatTotal = subtotal * 0.16;
  const grandTotal = subtotal + vatTotal;

  // 🟢 GALLERY LOGIC: Always show 3 images
  const galleryImages = useMemo(() => {
    if (!dbProducts.length) return [];

    const selectedProductImages = items
      .map(item => dbProducts.find(p => p.id === item.id)?.imageUrl)
      .filter(url => url && url.trim() !== "");
      
    const uniqueSelected = [...new Set(selectedProductImages)];
    let finalImages = uniqueSelected.slice(0, 2); 

    if (finalImages.length < 3) {
      const availableProducts = dbProducts.filter(p => 
        !items.some(item => item.id === p.id) && 
        p.imageUrl && 
        p.imageUrl.trim() !== ""
      );

      while (finalImages.length < 3 && availableProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableProducts.length);
        finalImages.push(availableProducts[randomIndex].imageUrl);
        availableProducts.splice(randomIndex, 1);
      }
    }
    return finalImages;
  }, [items, dbProducts]);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-[#f4f7f9] overflow-hidden font-sans">
        
        {/* LEFT SIDEBAR */}
        <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 shrink-0">
          <div className="p-6 border-b border-gray-100 bg-[#0D2B4E] text-white shrink-0">
            <h2 className="text-xl font-bold flex items-center">
              <Settings className="w-5 h-5 mr-2" /> Document Settings
            </h2>
            <p className="text-xs text-blue-200 mt-1">Configure your professional quote or poster.</p>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8">
            <div>
              <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4 mr-1" /> Document Type
              </label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-bold text-[#0D2B4E]"
              >
                <option value="Quotation">Quotation</option>
                <option value="Invoice">Tax Invoice</option>
                <option value="Poster">🎨 Marketing Poster</option>
              </select>
            </div>

            {docType !== "Poster" ? (
              <>
                <div>
                  <label className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    <User className="w-4 h-4 mr-1" /> Client Name
                  </label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Enter client name..."
                  />
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <label className="flex items-center text-xs font-bold text-[#0D2B4E] uppercase tracking-wider mb-3">
                    <Package className="w-4 h-4 mr-1" /> Add Items
                  </label>
                  <div className="flex items-center w-full gap-2">
                    <div className="w-[200px] max-w-full relative">
                      <select 
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-ellipsis overflow-hidden whitespace-nowrap"
                        disabled={isLoadingProducts}
                      >
                        <option value="">{isLoadingProducts ? "Loading..." : "-- Select --"}</option>
                        {dbProducts.map((p) => (
                          <option key={p.id} value={p.id} title={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={handleAddProduct} 
                      className="bg-[#0D2B4E] hover:bg-[#1a3c66] text-white px-4 py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selected Items ({items.length})</label>
                  </div>
                  
                  {items.length === 0 ? (
                    <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-400 font-medium">No items added yet.</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm group">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">KES {item.price.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4">
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                   <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-3 flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" /> Poster Settings
                   </h3>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Main Title</label>
                        <input type="text" value={posterTitle} onChange={(e) => setPosterTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Subtitle</label>
                        <textarea value={posterSubtitle} onChange={(e) => setPosterSubtitle(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Call to Action</label>
                        <input type="text" value={posterCta} onChange={(e) => setPosterCta(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Image URL</label>
                        <input type="text" value={posterImageUrl} onChange={(e) => setPosterImageUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                   </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                      <Palette className="w-4 h-4 mr-1" /> Theme Colors
                   </h3>
                   <div className="grid grid-cols-3 gap-3">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-600 mb-1">Background</label>
                         <input type="color" value={posterBgColor} onChange={(e) => setPosterBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border border-gray-300 p-1 bg-white" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-600 mb-1">Text</label>
                         <input type="color" value={posterTextColor} onChange={(e) => setPosterTextColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border border-gray-300 p-1 bg-white" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-600 mb-1">Accent</label>
                         <input type="color" value={posterAccentColor} onChange={(e) => setPosterAccentColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border border-gray-300 p-1 bg-white" />
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            <button 
              onClick={handleDownload} 
              disabled={isDownloading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center disabled:opacity-70 disabled:shadow-none hover:-translate-y-0.5"
            >
              {isDownloading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Download className="w-5 h-5 mr-2" /> Download {docType === "Poster" ? "Poster" : "PDF"}</>}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - LIVE PREVIEW */}
        <div className="flex-1 p-8 flex justify-center bg-gray-200 overflow-auto items-start">
          
          {docType === "Poster" ? (
             <div 
               ref={posterRef}
               className="shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 shrink-0"
               style={{ width: '600px', height: '848px', backgroundColor: posterBgColor, color: posterTextColor }}
             >
               <div style={{ backgroundColor: posterAccentColor, height: '15px', width: '100%' }}></div>
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                 <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ color: posterTextColor }}>{posterTitle}</h1>
                 <p className="text-xl font-medium max-w-md mx-auto mb-10 opacity-90 leading-relaxed">{posterSubtitle}</p>
                 {posterImageUrl && (
                   <div className="w-full h-64 mb-10 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                     <img src={posterImageUrl} alt="Poster" className="w-full h-full object-cover" crossOrigin="anonymous" />
                   </div>
                 )}
                 <div className="mt-auto px-10 py-5 rounded-full font-bold text-xl uppercase tracking-wide shadow-xl" style={{ backgroundColor: posterAccentColor, color: '#000' }}>
                   {posterCta}
                 </div>
               </div>
               <div style={{ backgroundColor: posterAccentColor, height: '15px', width: '100%' }}></div>
               <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             </div>
          ) : (
             <div 
                ref={documentRef} 
                className="bg-white shadow-xl border border-gray-200 w-[794px] min-h-[1123px] flex flex-col p-12 relative shrink-0"
             >
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <img src="/logo.png" alt="Infield Logo" className="h-14 mb-4 object-contain" />
                      <p className="text-xs font-semibold text-[#0D2B4E]">P.O BOX 62700-19052, Meru Township</p>
                      <p className="text-xs font-semibold text-[#0D2B4E]">0701243548</p>
                   </div>
                   <div className="text-right">
                      <img src="/solar-default.png" alt="Solar Panels" className="h-20 w-28 object-contain ml-auto mb-2" />
                      <p className="text-sm font-bold text-[#0D2B4E]">{new Date().toLocaleDateString('en-GB')}</p>
                      <p className="text-[10px] text-gray-500">Serial: QU-2026-1234</p>
                   </div>
                </div>

                <div className="text-center mb-10">
                   <h1 className="text-xl font-bold text-[#0D2B4E] underline decoration-2 underline-offset-4 uppercase tracking-wide">
                      {docType} FOR SUPPLY AND INSTALLATION
                   </h1>
                </div>
                
                <div className="mb-8">
                   <p className="font-bold text-[#0D2B4E] text-sm mb-2">To: {clientName}</p>
                   <p className="text-sm text-gray-600 mb-2">Dear Sir/Madam,</p>
                   <p className="text-sm text-gray-600">We are grateful for your inquiry concerning the above subject matter. We are now pleased to forward our quote, terms & conditions to you.</p>
                </div>

                <div className="mb-8 flex-1">
                   <div className="grid grid-cols-[1fr_60px_60px_100px_100px] gap-2 border-y-2 border-[#0D2B4E] py-2 text-xs font-bold text-[#0D2B4E]">
                      <div>DESCRIPTION</div>
                      <div className="text-center">QTY</div>
                      <div className="text-center">VAT</div>
                      <div className="text-right">UNIT PRICE</div>
                      <div className="text-right">AMOUNT</div>
                   </div>
                   {items.length === 0 ? (
                     <div className="text-center py-12 text-sm text-gray-400 italic">No items added to quotation.</div>
                   ) : (
                     items.map((item, idx) => (
                       <div key={idx} className="grid grid-cols-[1fr_60px_60px_100px_100px] gap-2 py-3 border-b border-gray-100 text-sm">
                          <div>{item.name}</div>
                          <div className="text-center">{item.qty}</div>
                          <div className="text-center">{item.vat}%</div>
                          <div className="text-right">{item.price.toLocaleString()}</div>
                          <div className="text-right">{(item.price * item.qty).toLocaleString()}</div>
                       </div>
                     ))
                   )}
                   
                   <div className="flex justify-end mt-4">
                      <div className="w-64 space-y-2 text-sm">
                         <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
                         <div className="flex justify-between text-gray-600"><span>VAT (16%)</span><span>{vatTotal.toLocaleString()}</span></div>
                         <div className="flex justify-between font-bold text-[#0D2B4E] border-t-2 border-[#0D2B4E] pt-2"><span>TOTAL KES</span><span>{grandTotal.toLocaleString()}</span></div>
                      </div>
                   </div>
                </div>

                {/* 🟢 PROFESSIONAL IMAGE GALLERY (No Text) 🟢 */}
                {galleryImages.length > 0 && (
                  <div className="mb-8 grid grid-cols-3 gap-4">
                    {galleryImages.map((imgUrl, index) => (
                      <div key={index} className="aspect-[4/3] relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.currentTarget.parentElement!.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-100 p-5 rounded mb-8">
                   <p className="font-bold text-[#0D2B4E] mb-2 text-xs">TERMS & CONDITIONS:</p>
                   <ul className="text-[11px] text-gray-600 space-y-1">
                      <li>Delivery: EX STOCK SUBJECT TO PRIOR SALES.</li>
                      <li>Validity: THIS PRICE VALID FOR 1 WEEK.</li>
                      <li>Payment: IN FULL PRIOR TO SUPPLY.</li>
                   </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                   <div className="border border-gray-300 rounded-lg p-5 w-full bg-white mb-10">
                      <p className="text-center font-bold text-[10px] text-gray-800 mb-4 uppercase tracking-wider">PAYMENT OPTIONS</p>
                      
                      <div className="flex justify-between text-[10px] text-center text-gray-700">
                        <div className="w-1/3 px-2 border-r border-gray-200 flex flex-col items-center">
                          <img src="/payment-logos/kingdom.png" alt="Kingdom Bank" style={{ height: '35px', objectFit: 'contain', marginBottom: '8px' }} crossOrigin="anonymous" />
                          <p className="font-bold text-[#0a1f44] mb-1">Kingdom Bank</p>
                          <p>Name: Infield Eng. Co.</p>
                          <p>Acc: 5021964795002</p>
                          <p>Code: 01103043839002</p>
                        </div>
                        
                        <div className="w-1/3 px-2 border-r border-gray-200 flex flex-col items-center">
                          <img src="/payment-logos/co-operative_bank.png" alt="Co-op Bank" style={{ height: '35px', objectFit: 'contain', marginBottom: '8px' }} crossOrigin="anonymous" />
                          <p className="font-bold text-[#0a1f44] mb-1">Co-operative Bank</p>
                          <p>Business: 1170535</p>
                          <p>Acc No: 400200</p>
                        </div>
                        
                        <div className="w-1/3 px-2 flex flex-col items-center">
                          <img src="/payment-logos/mpesa.png" alt="M-Pesa" style={{ height: '35px', objectFit: 'contain', marginBottom: '8px' }} crossOrigin="anonymous" />
                          <p className="font-bold text-[#0a1f44] mb-1">M-Pesa</p>
                          <p>Paybill: 247247</p>
                          <p>Acc: 0701243548</p>
                        </div>
                      </div>
                   </div>
                   
                   <div className="w-full flex justify-end pb-4">
                      <div className="w-64 flex flex-col items-center">
                         <div className="border-t border-gray-400 w-full mb-2 mt-8"></div>
                         <p className="text-2xl font-serif italic text-[#0D2B4E] mb-1">Alphonce Juma</p>
                         <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-6">Authorized Signatory</p>
                         <p className="text-[10px] text-gray-600 font-semibold mb-1">{new Date().toLocaleDateString('en-GB')}</p>
                         <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Date</p>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
