export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D2B4E", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", textAlign: "center", padding: "24px" }}>
      <div>
        <h1 style={{ fontSize: "72px", fontWeight: 900, margin: 0, color: "#4FC3F7" }}>404</h1>
        <p style={{ fontSize: "18px", marginTop: "12px" }}>Page not found</p>
        <a href="/" style={{ display: "inline-block", marginTop: "24px", background: "#1E88E5", color: "#fff", padding: "12px 28px", borderRadius: "10px", textDecoration: "none", fontWeight: 700 }}>Go Home</a>
      </div>
    </div>
  );
}
