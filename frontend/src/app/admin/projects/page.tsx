'use client';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  start: number;   // day offset from week start
  duration: number; // days
  status: 'Complete' | 'In Progress' | 'Pending' | 'Issue';
  owner: string;
}

const seedProjects: Project[] = [
  { id: 'P-001', name: 'Solar Install: 10kW Kit',   start: 0, duration: 4, status: 'Complete',    owner: 'Henry K.' },
  { id: 'P-002', name: 'Panel Upgrade: Rooftop',    start: 2, duration: 3, status: 'In Progress', owner: 'Alex M.' },
  { id: 'P-003', name: 'Electrical Rewiring',       start: 5, duration: 2, status: 'Pending',     owner: 'Jane W.' },
  { id: 'P-004', name: 'Pump Service: Borehole',    start: 1, duration: 5, status: 'In Progress', owner: 'Peter O.' },
  { id: 'P-005', name: 'Water Tank Install',        start: 6, duration: 3, status: 'Pending',     owner: 'Alex M.' },
  { id: 'P-006', name: 'Inverter Diagnostics',      start: 3, duration: 2, status: 'Issue',       owner: 'Henry K.' },
];

const statusStyle = (s: string) => ({
  Complete:    { bg: '#DCFCE7', fg: '#166534', bar: '#16A34A' },
  'In Progress': { bg: '#DBEAFE', fg: '#1E40AF', bar: '#1E88E5' },
  Pending:     { bg: '#FEF3C7', fg: '#92400E', bar: '#F59E0B' },
  Issue:       { bg: '#FEE2E2', fg: '#991B1B', bar: '#DC2626' },
}[s] || { bg: '#E2E8F0', fg: '#475569', bar: '#64748b' });

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const days = 9;

  return (
    <Layout requireAdmin>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>Project Timeline</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '6px 0 0' }}>Week overview — Gantt chart of active engineering projects</p>
          </div>
          <button
            onClick={() => {
              const name = prompt('Project name?');
              if (!name) return;
              setProjects(p => [...p, {
                id: 'P-' + String(p.length + 1).padStart(3, '0'),
                name, start: 0, duration: 3, status: 'Pending', owner: 'You',
              }]);
            }}
            style={{ background: 'linear-gradient(135deg,#1E88E5,#1565C0)', color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
          >
            + New Project
          </button>
        </div>

        {/* Gantt */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EEF2F6', padding: 20, overflowX: 'auto' }}>
          {/* Day header */}
          <div style={{ display: 'grid', gridTemplateColumns: `minmax(200px,1.2fr) minmax(120px,0.7fr) repeat(${days}, minmax(50px,1fr))`, gap: 0, alignItems: 'center', marginBottom: 12, fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <div>Project</div>
            <div>Owner</div>
            {Array.from({ length: days }).map((_, i) => (
              <div key={i} style={{ textAlign: 'center' }}>Day {i + 1}</div>
            ))}
          </div>

          {projects.map(p => {
            const st = statusStyle(p.status);
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: `minmax(200px,1.2fr) minmax(120px,0.7fr) repeat(${days}, minmax(50px,1fr))`, gap: 0, alignItems: 'center', padding: '10px 0', borderTop: '1px solid #F8FAFC' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0D2B4E', fontSize: 13 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{p.id}</span>
                    <span style={{ background: st.bg, color: st.fg, padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{p.status}</span>
                  </div>
                </div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{p.owner}</div>
                {Array.from({ length: days }).map((_, day) => {
                  const inBar = day >= p.start && day < p.start + p.duration;
                  const isFirst = day === p.start;
                  const isLast = day === p.start + p.duration - 1;
                  return (
                    <div key={day} style={{ padding: '8px 2px', position: 'relative' }}>
                      {inBar && (
                        <div style={{
                          background: st.bar, height: 24,
                          borderTopLeftRadius: isFirst ? 6 : 0,
                          borderBottomLeftRadius: isFirst ? 6 : 0,
                          borderTopRightRadius: isLast ? 6 : 0,
                          borderBottomRightRadius: isLast ? 6 : 0,
                          opacity: 0.9,
                          boxShadow: `0 2px 6px ${st.bar}40`,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap', fontSize: 12, color: '#64748b' }}>
          {['Complete', 'In Progress', 'Pending', 'Issue'].map(s => {
            const st = statusStyle(s);
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: st.bar, display: 'inline-block' }} />
                {s}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
