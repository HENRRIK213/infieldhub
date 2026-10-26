'use client';
import { UPLOADS_URL } from '@/lib/api';

export default function ProductCard({ product, onClick, onEdit, isAdmin }: { product: any, onClick: () => void, onEdit?: (e: any) => void, isAdmin: boolean }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer flex flex-col relative group">
      
      {isAdmin && onEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow z-10"
        >
          ✏️ Edit
        </button>
      )}

      <div className="absolute top-3 right-3 bg-[#E1F5FE] text-[#0D2B4E] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider z-10">
        {product.category || 'General'}
      </div>

      <div className="aspect-square bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl.startsWith('http') ? product.imageUrl : `${UPLOADS_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="text-6xl opacity-50">📦</span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
        <h3 className="font-bold text-[#0D2B4E] text-sm leading-tight line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand} • {product.size}</p>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-extrabold text-[#1E88E5]">KSH {product.price.toLocaleString()}</span>
          <button className="bg-[#0D2B4E] text-white text-xs px-3 py-1.5 rounded-lg">View Types</button>
        </div>
      </div>
    </div>
  );
}