'use client';
import Layout from '@/components/Layout';

export default function ReportsPage() {
  
  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('report-area');
      const opt: any = {
        margin: 0.5, filename: `Business-Report-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      alert('Error generating PDF');
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Business Reports</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Financial overview and performance metrics.</p>
          </div>
          <button onClick={handleDownloadPDF} style={{ background: '#0D2B4E', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ⬇ Download PDF
          </button>
        </div>

        <div id="report-area" style={{ background: '#fff', padding: 40, borderRadius: 16, border: '1px solid #e2e8f0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>InfieldHub Engineering</h2>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Generated on: {new Date().toLocaleDateString()}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 40 }}>
            <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981', marginTop: 8 }}>KSH 1,240,500</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Quotes Generated</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1E88E5', marginTop: 8 }}>84</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Invoices Paid</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#8b5cf6', marginTop: 8 }}>42</div>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E', borderBottom: '2px solid #e2e8f0', paddingBottom: 12, marginBottom: 20 }}>Recent Performance Summary</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: 12 }}>Category</th>
                <th style={{ padding: 12 }}>Status</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Value (KSH)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: 12 }}>Solar Panel Installations</td><td><span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Active</span></td><td style={{ padding: 12, textAlign: 'right', fontWeight: 700 }}>850,000</td></tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: 12 }}>Water Pump Services</td><td><span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Active</span></td><td style={{ padding: 12, textAlign: 'right', fontWeight: 700 }}>390,500</td></tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: 12 }}>Electrical Upgrades</td><td><span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Pending</span></td><td style={{ padding: 12, textAlign: 'right', fontWeight: 700 }}>120,000</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}
