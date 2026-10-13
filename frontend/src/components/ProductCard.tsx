'use client';
import { UPLOADS_URL } from '@/lib/api';

export default function ProductCard({
  product,
  onClick,
}: {
  product: any;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="card cursor-pointer hover:shadow-lg transition group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
        {product.imageUrl ? (
          <img
            src={`${UPLOADS_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="font-semibold text-[#0D2B4E] truncate">{product.name}</h3>
      <p className="text-sm text-gray-500 truncate">{product.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-[#1E88E5]">
          KES {product.price.toLocaleString()}
        </span>
        {product.vat ? (
          <span className="badge-info">VAT</span>
        ) : (
          <span className="badge-pending">No VAT</span>
        )}
      </div>
    </div>
  );
}