'use client';
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', marginTop: 40 }}>
      <h2 style={{ fontSize: 24, color: 'red', fontWeight: 'bold' }}>Something went wrong!</h2>
      <p style={{ marginTop: 16, padding: 16, background: '#fee', color: '#900', borderRadius: 8, fontFamily: 'monospace' }}>
        {error.message}
      </p>
      <button onClick={() => reset()} style={{ marginTop: 24, padding: '10px 20px', background: '#1E88E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Try again</button>
    </div>
  );
}
