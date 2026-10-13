'use client';
import Layout from '@/components/Layout';
import { api, UPLOADS_URL } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => router.push('/products'));
  }, [id, router]);

  if (!product)
    return (
      <Layout>
        <div className="p-10">Loading…</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-4 shadow">
          {product.imageUrl ? (
            <img
              src={`${UPLOADS_URL}${product.imageUrl}`}
              alt={product.name}
              className="w-full rounded-xl"
            />
          ) : (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B4E]">{product.name}</h1>
          <p className="text-[#1E88E5] mt-1">
            {product.category} {product.subCategory && `• ${product.subCategory}`}
          </p>
          <p className="text-4xl font-extrabold text-[#0D2B4E] mt-4">
            KES {product.price.toLocaleString()}
          </p>
          {product.vat && (
            <p className="text-green-600 text-sm mt-1">VAT applicable</p>
          )}
          <div className="mt-6">
            <h2 className="font-semibold text-[#0D2B4E] mb-2">Product Details</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.longDescription || product.description || 'No description.'}
            </p>
          </div>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm">
            Stock: <b>{product.stock}</b> • Status:{' '}
            <span className="badge-approved">{product.status}</span>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="btn-primary flex-1">Add to Quotation</button>
            <button className="btn-success flex-1">Buy Now</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}