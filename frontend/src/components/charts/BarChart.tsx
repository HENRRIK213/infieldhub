'use client';
export default function BarChart({ data, color = '#1E88E5', height = 90 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data, 1);
  const barW = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 10);
        return (
          <rect
            key={i}
            x={i * barW + barW * 0.15}
            y={height - h}
            width={barW * 0.7}
            height={h}
            fill={color}
            rx="1"
            opacity={0.4 + (i / data.length) * 0.6}
          />
        );
      })}
    </svg>
  );
}
