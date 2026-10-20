'use client';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function CustomerCardPage() {
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
              <span style={{ cursor: 'pointer', border: '1px solid #0EA5E9', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</span>
              <span style={{ cursor: 'pointer' }}>➕</span>
              <span style={{ cursor: 'pointer' }}>🗑️</span>
            </div>
          </div>

          {/* MAIN TITLE */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #E5E7EB' }}>
            <h1 style={{ fontSize: 26, fontWeight: 300, color: '#374151', margin: 0, letterSpacing: '0.02em' }}>
              253654 · INFIELD ECO WATER SYSTEMS ENGINEERING
            </h1>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 24px', fontSize: 13, color: '#4B5563' }}>
            <div style={{ padding: '12px 16px', borderBottom: '2px solid #0EA5E9', fontWeight: 600, color: '#0369A1', cursor: 'pointer' }}>Process</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>New Document</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Navigate</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Customer</div>
            <div style={{ width: 1, background: '#E5E7EB', margin: '8px 16px' }}></div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Actions</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Navigate</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Report</div>
            <div style={{ padding: '12px 16px', cursor: 'pointer' }}>Fewer options</div>
          </div>

          {/* CONTENT BODY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>
            
            {/* LEFT SIDE (FORM) */}
            <div style={{ padding: 24, borderRight: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>General</h2>
                <span style={{ fontSize: 12, color: '#0EA5E9', cursor: 'pointer' }}>Show less</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 60px' }}>
                
                {/* LEFT COLUMN FIELDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  
                  {/* Field: No. */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>No.</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="text" value="253654" readOnly style={{ flex: 1, background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }} />
                      <button style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 10px', borderRadius: 2, cursor: 'pointer' }}>...</button>
                    </div>
                  </div>

                  {/* Field: Name */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Name</div>
                    <input type="text" value="INFIELD ECO WATER SYSTEMS" readOnly style={{ flex: 1, background: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }} />
                  </div>

                  {/* Field: Balance */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Balance (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Unavailable Balance */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Unavailable Balance...</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Balance Due */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Balance Due (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Credit Limit */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Credit Limit (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#DC2626', paddingRight: 8 }}>1.00</div>
                  </div>
                  
                  {/* Field: Total Job Credit */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Total Job Credit (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Post Dated Checks */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Post Dated Checks ...</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Provisional Balance */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Provisional Balance...</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#0369A1', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Blocked */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Blocked</div>
                    <div style={{ flex: 1 }}></div>
                  </div>

                </div>

                {/* RIGHT COLUMN FIELDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  
                  {/* Field: Customer Status */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Customer Status</div>
                    <select style={{ flex: 1, background: '#fff', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  {/* Field: DPA Consent */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>DPA Consent Given</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ width: 44, height: 22, background: '#CBD5E1', borderRadius: 11, position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: 2 }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Field: Costs */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Costs (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#111827', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Profit */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Profit (LCY)</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#111827', paddingRight: 8 }}>0.00</div>
                  </div>

                  {/* Field: Profit % */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Profit %</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#111827', paddingRight: 8 }}>0.0</div>
                  </div>

                  {/* Field: Last Date Modified */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Last Date Modified</div>
                    <div style={{ flex: 1, fontSize: 13, color: '#111827', paddingLeft: 8 }}>13/10/2026</div>
                  </div>

                  {/* Field: Old Ref No */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Old Ref. No.</div>
                    <input type="text" style={{ flex: 1, background: '#fff', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }} />
                  </div>

                  {/* Field: Created By */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Created By</div>
                    <div style={{ flex: 1, fontSize: 13, color: '#111827', paddingLeft: 8 }}>ECHACHA</div>
                  </div>

                  {/* Field: Account Manager */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Account Manager</div>
                    <select style={{ flex: 1, background: '#fff', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }}>
                      <option>KNGAI</option>
                    </select>
                  </div>

                  {/* Field: Sub Category */}
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #CBD5E1', paddingBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 13, color: '#4B5563' }}>Sub Category</div>
                    <select style={{ flex: 1, background: '#fff', border: '1px solid #D1D5DB', padding: '6px 8px', fontSize: 13, borderRadius: 2, color: '#111827' }}>
                      <option>PRIVATE-TRADE-SERVICE</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (DETAILS) */}
            <div style={{ background: '#F9FAFB', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 16, color: '#4B5563' }}>ⓘ</span>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Details</h3>
              </div>
              
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>
                Domiciled Business<br/>
                You can add specific details here.
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>Department Name</div>
                <div style={{ fontSize: 13, color: '#111827' }}>Sales Retail</div>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>Customer Ag...</div>
                <div style={{ fontSize: 13, color: '#111827' }}>General</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
