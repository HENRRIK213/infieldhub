'use client';
import Layout from '@/components/Layout';

export default function CustomerCardPage() {
  return (
    <Layout requireAdmin>
      <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: 20 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button style={{ background: '#fff', border: '1px solid #cbd5e1', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}>←</button>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>CUSTOMER CARD</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          {/* Header */}
          <div style={{ padding: 24, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: 24, fontWeight: 400, color: '#334155', margin: 0 }}>253654 · INFIELD ECO WATER SYSTEMS ENGINEERING</h1>
            <div style={{ display: 'flex', gap: 16, color: '#0ea5e9', fontSize: 20 }}>
              <span>✏️</span> <span>➕</span> <span>🗑️</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 20, padding: '0 24px', borderBottom: '1px solid #e2e8f0', fontSize: 13, color: '#334155' }}>
            <div style={{ padding: '12px 0', borderBottom: '2px solid #0ea5e9', fontWeight: 600 }}>Process</div>
            <div style={{ padding: '12px 0' }}>New Document</div>
            <div style={{ padding: '12px 0' }}>Navigate</div>
            <div style={{ padding: '12px 0' }}>Customer</div>
            <div style={{ padding: '12px 0', marginLeft: 'auto' }}>Actions</div>
            <div style={{ padding: '12px 0' }}>Report</div>
          </div>

          {/* Form Body */}
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            
            {/* Left Column */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 16 }}>General</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, alignItems: 'center', marginBottom: 12, fontSize: 13 }}>
                <div style={{ color: '#64748b' }}>No.</div>
                <input type="text" value="253654" readOnly style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 2, background: '#f8fafc' }} />
                
                <div style={{ color: '#64748b' }}>Name</div>
                <input type="text" value="INFIELD ECO WATER SYSTEMS" style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 2 }} />
                
                <div style={{ color: '#64748b' }}>Balance (LCY)</div>
                <div style={{ textAlign: 'right', color: '#0ea5e9' }}>0.00</div>
                
                <div style={{ color: '#64748b' }}>Balance Due (LCY)</div>
                <div style={{ textAlign: 'right', color: '#0ea5e9' }}>0.00</div>
                
                <div style={{ color: '#64748b' }}>Credit Limit (LCY)</div>
                <div style={{ textAlign: 'right', color: '#ef4444' }}>1.00</div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#334155' }}>Details</div>
                <div style={{ fontSize: 12, color: '#0ea5e9' }}>Show less</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, alignItems: 'center', marginBottom: 12, fontSize: 13 }}>
                <div style={{ color: '#64748b' }}>Customer Status</div>
                <select style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 2 }}><option>Active</option></select>

                <div style={{ color: '#64748b' }}>DPA Consent</div>
                <div style={{ width: 40, height: 20, background: '#cbd5e1', borderRadius: 10, position: 'relative' }}><div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: 2 }}></div></div>

                <div style={{ color: '#64748b' }}>Last Date Modified</div>
                <div style={{ color: '#334155' }}>13/10/2026</div>

                <div style={{ color: '#64748b' }}>Created By</div>
                <div style={{ color: '#334155' }}>ECHACHA</div>
                
                <div style={{ color: '#64748b' }}>Account Manager</div>
                <select style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 2 }}><option>KNGAI</option></select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
