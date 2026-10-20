'use client';
import Layout from '@/components/Layout';
import { useState } from 'react';

const initialTasks = [
  { id: '001', task: 'Mobilisation & Layout', dur: 2, start: 1, span: 1, color: '#3b82f6' },
  { id: '002', task: 'Trenching Works', dur: 9, start: 2, span: 2, color: '#f97316' },
  { id: '003', task: 'Pipe Position & Jointing', dur: 11, start: 3, span: 2, color: '#a855f7' },
];
const weeks = [1,2,3,4,5,6,7,8,9,10,11,12];

export default function GanttPage() {
  const [projectTitle, setProjectTitle] = useState('NEW PROJECT WORK PLAN');
  const [tasks, setTasks] = useState(initialTasks);

  // New Task State
  const [newTask, setNewTask] = useState({ task: '', dur: 1, start: 1, color: '#3b82f6' });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task) return;
    
    // Calculate span (duration in weeks, rounded up)
    const spanWeeks = Math.max(1, Math.ceil(newTask.dur / 5)); 
    
    const taskToAdd = {
      id: String(tasks.length + 1).padStart(3, '0'),
      task: newTask.task,
      dur: newTask.dur,
      start: newTask.start,
      span: spanWeeks,
      color: newTask.color
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({ task: '', dur: 1, start: 1, color: '#3b82f6' }); // reset form
  };

  const removeTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const handlePrint = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('print-area');
      const opt: any = {
        margin: 0.5, filename: `${projectTitle}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' } // A3 for Gantt
      };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      alert('Error generating PDF');
    }
  };

  return (
    <Layout requireAdmin>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        
        {/* LEFT: Builder Tools */}
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Gantt Builder</h2>
          
          <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Project Title</label>
          <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 16, fontWeight: 700 }} />

          <form onSubmit={handleAddTask} style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Add New Task</h3>
            
            <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Task Name</label>
            <input required value={newTask.task} onChange={e => setNewTask({...newTask, task: e.target.value})} style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4, marginBottom: 8, fontSize: 12 }} />

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Start Week (1-12)</label>
                <input type="number" min="1" max="12" value={newTask.start} onChange={e => setNewTask({...newTask, start: Number(e.target.value)})} style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration (Days)</label>
                <input type="number" min="1" value={newTask.dur} onChange={e => setNewTask({...newTask, dur: Number(e.target.value)})} style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }} />
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Color</label>
            <input type="color" value={newTask.color} onChange={e => setNewTask({...newTask, color: e.target.value})} style={{ width: '100%', height: 32, padding: 2, border: '1px solid #cbd5e1', borderRadius: 4, marginBottom: 12 }} />

            <button type="submit" style={{ width: '100%', background: '#1E88E5', color: '#fff', padding: 8, borderRadius: 6, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>+ Add Task</button>
          </form>

          <button onClick={handlePrint} style={{ width: '100%', background: '#0D2B4E', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            ⬇ Download PDF
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ background: '#e2e8f0', padding: 20, borderRadius: 12, overflowX: 'auto' }}>
          <div id="print-area" style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>1. P.O BOX62700-19052 Meru Township 0701243548</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginTop: 16, textTransform: 'uppercase' }}>{projectTitle}</h1>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: 10, width: 50, color: '#64748b' }}>ID</th>
                  <th style={{ padding: 10, width: 250, color: '#64748b' }}>TASK</th>
                  <th style={{ padding: 10, width: 60, color: '#64748b' }}>DUR</th>
                  {weeks.map(w => <th key={w} style={{ padding: 10, textAlign: 'center', color: '#64748b', width: 50 }}>WEEK {w}</th>)}
                  <th className="no-print" style={{ padding: 10, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && <tr><td colSpan={15} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No tasks added yet.</td></tr>}
                {tasks.map((t, idx) => {
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: 10, color: '#94a3b8' }}>{t.id}</td>
                      <td style={{ padding: 10, fontWeight: 600, color: '#0D2B4E' }}>{t.task}</td>
                      <td style={{ padding: 10, color: '#64748b' }}>{t.dur} d</td>
                      {weeks.map(w => {
                        const active = w >= t.start && w < t.start + t.span;
                        const isFirst = w === t.start;
                        const isLast = w === t.start + t.span - 1;
                        return (
                          <td key={w} style={{ padding: '10px 2px', position: 'relative' }}>
                            {active && (
                              <div style={{ background: t.color, height: 16, borderRadius: 8, borderTopLeftRadius: isFirst ? 8 : 0, borderBottomLeftRadius: isFirst ? 8 : 0, borderTopRightRadius: isLast ? 8 : 0, borderBottomRightRadius: isLast ? 8 : 0, width: '100%' }} />
                            )}
                          </td>
                        );
                      })}
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button onClick={() => removeTask(t.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 4, width: 24, height: 24, cursor: 'pointer' }}>X</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
