"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Download, Image as ImageIcon, Type, Palette, ArrowLeft, Upload, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";

export default function PosterCreatorPage() {
  const [title, setTitle] = useState("MEGA SALE");
  const [subtitle, setSubtitle] = useState("Up to 50% OFF on all Solar Equipment");
  const [cta, setCta] = useState("Call: 0701243548 to Order");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80");
  
  const [bgColor, setBgColor] = useState("#0D2B4E");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // High resolution
        useCORS: true, // Allow external images
        backgroundColor: bgColor,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `InfieldHub-Poster-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate poster", err);
      alert("Failed to download. Please ensure the image URL is valid and allows CORS.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR - CONTROLS */}
      <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Poster Creator</h2>
            <p className="text-xs text-gray-500 mt-1">Design professional marketing materials.</p>
          </div>
          <Link href="/admin" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center">
              <Type className="w-4 h-4 mr-2 text-blue-600" /> Content
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Main Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle / Offer</label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Call to Action</label>
              <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center">
              <Palette className="w-4 h-4 mr-2 text-blue-600" /> Design & Colors
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-xs text-gray-500 uppercase">{bgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  <span className="text-xs text-gray-500 uppercase">{textColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs text-gray-500 uppercase">{accentColor}</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-blue-600" /> Image
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm transition flex justify-center items-center disabled:opacity-70"
          >
            {isDownloading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Image...</>
            ) : (
              <><Download className="w-5 h-5 mr-2" /> Download Poster</>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - LIVE PREVIEW */}
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-200 overflow-auto">
        
        {/* A4 Proportions Aspect Ratio Container - We attach the ref here for html2canvas */}
        <div 
          ref={posterRef}
          className="shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300"
          style={{ 
            width: '600px', 
            height: '848px', 
            backgroundColor: bgColor, 
            color: textColor,
            borderRadius: '4px'
          }}
        >
          <div style={{ backgroundColor: accentColor, height: '12px', width: '100%' }}></div>

          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
            
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ color: textColor }}>
              {title}
            </h1>
            
            <p className="text-xl font-medium max-w-md mx-auto mb-10 opacity-90 leading-relaxed">
              {subtitle}
            </p>

            {imageUrl && (
              <div className="w-full h-64 mb-10 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                <img src={imageUrl} alt="Poster Graphic" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            )}

            <div 
              className="mt-auto px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide shadow-md"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              {cta}
            </div>

          </div>

          <div style={{ backgroundColor: accentColor, height: '12px', width: '100%' }}></div>
          
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

      </div>
    </div>
  );
}
