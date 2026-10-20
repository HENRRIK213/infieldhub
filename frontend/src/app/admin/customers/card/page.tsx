'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CustomerCardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Process');
  const [showLess, setShowLess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customerStatus, setCustomerStatus] = useState('Active');

  const tabs = ['Process', 'New Document', 'Navigate', 'Customer', 'Actions', 'Navigate', 'Report', 'Fewer options'];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      alert('Customer deleted successfully.');
      router.push('/admin/customers');
    }
  };

  const handleAdd = () => {
    router.push('/admin/customers/card/new');
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  return (
    <Layout requireAdmin>
      <div style={{ background: '#F3F4F6', minHeight: '100vh', padding: '24px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          {/* TOP HEADER BAR */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
            <Link href="/admin/customers" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', textDecoration: 'none', fontSize: 18, marginRight: 16 }}>
              ←
            </Link>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CUSTOMER CARD</div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, color: '#0EA5E9', fontSize: 20 }}>
              <span 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                style={{ cursor: 'pointer', border: '1px solid #0EA5E9', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isEditing ? '#0EA5E9' : 'transparent', color: isEditing ? '#fff' : '#0EA5E9' }}
              >
                {isEditing ? '💾' : '✏️'}
              </span>
              <span onClick={handleAdd} style={{ cursor: 'pointer' }}>➕</span>
              <span onClick={handleDelete} style={{ cursor: 'pointer', color: '#EF4444' }}>🗑️</span>
            </div>
          </div>

          {/* MAIN TITLE */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #E5E7EB' }}>
            <h1 style={{ fontSize: 26, fontWeight: 300, color: '#374151', margin: 0, letterSpacing: '0.02em' }}>
              253654 · INFIELD ECO WATER SYSTEMS ENGINEERING
            </h1>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 24px', fontSize: 13, color: '#4B5563', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '12px 16px', 
                  borderBottom: activeTab === tab ? '2px solid #0EA5E9' : '2px solid transparent', 
                  fontWeight: activeTab === tab ? 600 : 400, 
                  color: activeTab === tab ? '#0369A1' : '#4B5563', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* CONTENT BODY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>
            
            {/* MAIN TAB CONTENT */}
            <div style={{ padding: 24, borderRight: '1px solid #E5E7EB', minHeight: 500 }}>
              
              {activeTab === 'Process' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>General</h2>
                    <span onClick={() => setShowLess(!showLess)} style={{ fontSize: 12, color: '#0EA5E9', cursor: 'pointer' }}>
                      {showLess ? 'Show more' : 'Show less'}
                    </span>
                  </div>

                  {!showLess && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 60px' }}>
                      
                      {/* LEFT COLUMN */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>No.</div>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="text" value="253654" readOnly style={{ flex: 1, background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2 }} />
                            <button style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: 2, cursor: 'pointer' }}>...</button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Name</div>
                          <input type="text" defaultValue="INFIELD ECO WATER SYSTEMS" readOnly={!isEditing} style={{ flex: 1, background: isEditing ? '#fff' : '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2 }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Balance (LCY)</div>
                          <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Credit Limit (LCY)</div>
                          <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#DC2626', paddingRight: 8 }}>1.00</div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Customer Status</div>
                          <select 
                            value={customerStatus} 
                            onChange={(e) => setCustomerStatus(e.target.value)}
                            disabled={!isEditing}
                            style={{ flex: 1, background: isEditing ? '#fff' : '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2 }}
                          >
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Last Date Modified</div>
                          <div style={{ flex: 1, fontSize: 13, color: '#111827', paddingLeft: 8 }}>{new Date().toLocaleDateString()}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                          <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Account Manager</div>
                          <select disabled={!isEditing} style={{ flex: 1, background: isEditing ? '#fff' : '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2 }}>
                            <option>KNGAI</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'New Document' && (
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Create New Document</h2>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Link href="/admin/documents" style={{ background: '#1E88E5', color: '#fff', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Create Quotation</Link>
                    <Link href="/admin/documents" style={{ background: '#10B981', color: '#fff', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Create Invoice</Link>
                  </div>
                </div>
              )}

              {activeTab === 'Actions' && (
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Available Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
                    <button onClick={() => alert('Generating Customer Statement PDF...')} style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '10px', borderRadius: 4, textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>📄 Print Customer Statement</button>
                    <button onClick={() => alert('Exporting data to Excel...')} style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '10px', borderRadius: 4, textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>📊 Export Ledger Entries</button>
                    <button onClick={handleDelete} style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '10px', borderRadius: 4, textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>🗑️ Delete Customer Record</button>
                  </div>
                </div>
              )}

              {/* Fallback for other tabs */}
              {!['Process', 'New Document', 'Actions'].includes(activeTab) && (
                <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#6B7280' }}>{activeTab} Panel</h2>
                  <p style={{ fontSize: 14 }}>This section is currently being configured for customer {customerStatus}.</p>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR (DETAILS) */}
            <div style={{ background: '#F9FAFB', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 16, color: '#4B5563' }}>ⓘ</span>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Details</h3>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>
                Domiciled Business<br/>You can add specific details here.
              </div>
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>Department Name</div>
                <div style={{ fontSize: 13, color: '#111827' }}>Sales Retail</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
