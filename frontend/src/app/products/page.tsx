'use client';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  
  // 3-Tier Filters
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const isAdmin = user?.role === 'ADMIN';

  const load = async () => {
    const res = await api.get('/products', { params: { search, category } });
    setProducts(res.data);
  };
  
  useEffect(() => { load(); }, [search, category]);

  const handleEditClick = (product: any) => {
    router.push('/products/admin');
  };

  // Extract unique values for dropdowns based on current selection
  const brands = [...new Set(products.filter(p => !category || p.category === category).map(p => p.brand).filter(Boolean))];
  const sizes = [...new Set(products.filter(p => (!category || p.category === category) && (!brand || p.brand === brand)).map(p => p.size).filter(Boolean))];

  // Apply filters
  const filteredProducts = products.filter(p => {
    return (brand === '' || p.brand === brand) && (size === '' || p.size === size);
  });

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B4E]">Product Catalog</h1>
          <p className="text-sm text-gray-500">Filter by category, brand, and size.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <input className="input flex-1 lg:w-48" placeholder="Search name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input flex-1 lg:w-40" value={category} onChange={(e) => { setCategory(e.target.value); setBrand(''); setSize(''); }}>
            <option value="">All Categories</option>
            <option value="Water Solutions">Water Solutions</option>
            <option value="Solar Solutions">Solar Solutions</option>
            <option value="Electrical">Electrical</option>
          </select>
          <select className="input flex-1 lg:w-40" value={brand} onChange={(e) => { setBrand(e.target.value); setSize(''); }} disabled={!category && brands.length === 0}>
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="input flex-1 lg:w-32" value={size} onChange={(e) => setSize(e.target.value)} disabled={(!brand && !category) && sizes.length === 0}>
            <option value="">All Sizes</option>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onClick={() => setSelected(p)} 
            onEdit={handleEditClick}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && <p className="text-center text-gray-500 mt-10">No products found for this filter combination.</p>}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}