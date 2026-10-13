'use client';
import { useState } from 'react';
import { UPLOADS_URL } from '@/lib/api';

export default function ProductModal({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-100 p-3 md:p-4">
            {product.imageUrl ? (
              <img
                src={`${UPLOADS_URL}${product.imageUrl}`}
                alt={product.name}
                className="w-full h-64 md:h-full object-contain md:max-h-[500px] rounded-lg"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-5 md:p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl md:text-2xl font-bold text-[#0D2B4E]">
                {product.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-[#1E88E5] mt-1">
              {product.category} {product.subCategory && `• ${product.subCategory}`}
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-[#0D2B4E] mt-3">
              KES {product.price.toLocaleString()}
            </p>
            {product.vat && (
              <p className="text-xs text-green-600 mt-1">VAT applicable</p>
            )}
            <div className="mt-4">
              <h3 className="font-semibold text-[#0D2B4E] mb-1">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {product.longDescription || product.description || 'No description provided.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-medium">Qty:</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                className="input w-24"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button className="btn-primary flex-1">Add to Quotation</button>
              <button className="btn-success flex-1">Buy Now</button>
            </div>
            <p className="text-xs text-gray-500 mt-3">In stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}