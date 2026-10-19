'use client';
import Layout from '@/components/Layout';

const tasks = [
  { id: '001', task: 'Mobilisation & Layout', dur: '2 d', start: 1, span: 1, color: '#3b82f6', stage: 1 },
  { id: '002', task: 'Trenching Works', dur: '9 d', start: 2, span: 3, color: '#f97316', stage: 1 },
  { id: '003', task: 'Pipe Position & Jointing', dur: '11 d', start: 3, span: 3, color: '#a855f7', stage: 1 },
  { id: '004', task: 'Valve Chambers', dur: '3 d', start: 5, span: 1, color: '#eab308', stage: 1 },
  { id: '005', task: 'Service Line Connectors', dur: '10 d', start: 6, span: 3, color: '#14b8a6', stage: 1 },
  { id: '006', task: 'Backfilling & Cleanup', dur: '12 d', start: 7, span: 3, color: '#94a3b8', stage: 1 },
  { id: '001_B', task: 'Mobilisation & Layout', dur: '2 d', start: 6, span: 1, color: '#3b82f6', stage: 2 },
  { id: '002_B', task: 'Trenching Works', dur: '18 d', start: 4, span: 4, color: '#f97316', stage: 2 },
  { id: '003_B', task: 'Pipe Position & Jointing', dur: '20 d', start: 8, span: 4, color: '#a855f7', stage: 2 },
  { id: '004_B', task: 'Backfilling & Cleanup', dur: '10 d', start: 9, span: 2, color: '#94a3b8', stage: 2 },
  { id: '001_C', task: 'Mobilisation & Layout', dur: '2 d', start: 10, span: 1, color: '#3b82f6', stage: 3 },
  { id: '002_C', task: 'Trenching Works', dur: '18 d', start: 7, span: 4, color: '#f97316', stage: 3 },
  { id: '003_C', task: 'Pipe Position & Jointing', dur: '20 d', start: 10, span: 4, color: '#a855f7', stage: 3 },
  { id: '004_C', task: 'Backfilling, Test & commission', dur: '11 d', start: 12, span: 2, color: '#22c55e', stage: 3 },
];
const weeks = [1,2,3,4,5,6,7,8,9,10,11,12];

export default function GanttPage() {
  return (
    <Layout requireAdmin>
      <div style={{ background: '#fff', padding: 24, borderRadius: 16, overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>1. P.O BOX62700-19052 Meru Township 0701243548</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginTop: 16 }}>MAKUTANO -NKANGA WORK PLAN</h1>
        </div>
        <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: 10, width: 50, color: '#64748b' }}>ID</th>
              <th style={{ padding: 10, width: 250, color: '#64748b' }}>TASK</th>
              <th style={{ padding: 10, width: 60, color: '#64748b' }}>DUR</th>
              {weeks.map(w => <th key={w} style={{ padding: 10, textAlign: 'center', color: '#64748b', width: 50 }}>WEEK {w}</th>)}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, idx) => {
              const prevTask = tasks[idx - 1];
              const isNewStage = prevTask && prevTask.stage !== t.stage;
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', background: t.stage % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: 10, color: '#94a3b8' }}>{t.id}</td>
                  <td style={{ padding: 10, fontWeight: 600, color: '#0D2B4E' }}>{t.task}</td>
                  <td style={{ padding: 10, color: '#64748b' }}>{t.dur}</td>
                  {weeks.map(w => {
                    const active = w >= t.start && w < t.start + t.span;
                    const isFirst = w === t.start;
                    const isLast = w === t.start + t.span - 1;
                    return (
                      <td key={w} style={{ padding: '10px 2px', position: 'relative' }}>
                        {isNewStage && w === 1 && <div style={{ position: 'absolute', left: 0, top: -1, bottom: -1, borderLeft: '2px dashed #94a3b8' }} />}
                        {active && (
                          <div style={{ background: t.color, height: 16, borderRadius: 8, borderTopLeftRadius: isFirst ? 8 : 0, borderBottomLeftRadius: isFirst ? 8 : 0, borderTopRightRadius: isLast ? 8 : 0, borderBottomRightRadius: isLast ? 8 : 0, width: '100%' }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 20, marginTop: 24, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#3b82f6', borderRadius: 2 }}></span> Mobilization</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#f97316', borderRadius: 2 }}></span> Trenching</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#a855f7', borderRadius: 2 }}></span> Pipe Works</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#eab308', borderRadius: 2 }}></span> Valve Chambers</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#14b8a6', borderRadius: 2 }}></span> Svc Connectors</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#94a3b8', borderRadius: 2 }}></span> Back fill</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#22c55e', borderRadius: 2 }}></span> Test & commission</div>
        </div>
      </div>
    </Layout>
  );
}
