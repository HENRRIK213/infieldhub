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
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => router.push('/products'));
  }, [id, router]);

  if (!product) return <Layout><div style={{ padding: 100, textAlign: 'center' }}>Loading...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 16px' }}>
        <button onClick={() => router.back()} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#1E88E5', fontWeight: 700, cursor: 'pointer' }}>
          ← Back to Store
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32 }}>
          {/* Image */}
          <div style={{ background: '#F8FAFC', borderRadius: 12, overflow: 'hidden', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl ? (
              <img src={`${UPLOADS_URL}${product.imageUrl}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 80 }}>📦</span>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1E88E5', textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0D2B4E', marginTop: 8, marginBottom: 16 }}>{product.name}</h1>
            
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <span style={{ background: '#E1F5FE', color: '#0D2B4E', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Brand: {product.brand}</span>
              <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Size: {product.size}</span>
            </div>

            <div style={{ fontSize: 36, fontWeight: 900, color: '#0D2B4E', marginBottom: 24 }}>
              KSH {product.price.toLocaleString()}
            </div>

            <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: 32 }}>
              {product.longDescription || product.description || 'No description available.'}
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => router.push('/quotations')} style={{ flex: 1, padding: 16, background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,136,229,0.3)' }}>
                Add to Quotation
              </button>
              <button style={{ flex: 1, padding: 16, background: '#2E7D32', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}