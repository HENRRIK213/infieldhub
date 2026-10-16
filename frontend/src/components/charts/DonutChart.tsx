'use client';
export default function DonutChart({ percent, size = 130, color = '#0D2B4E', track = '#E2E8F0' }: { percent: number; size?: number; color?: string; track?: string }) {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="14" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="14"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="52%" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0D2B4E">{percent}%</text>
    </svg>
  );
}
