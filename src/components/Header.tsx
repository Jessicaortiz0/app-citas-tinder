export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        padding: "1.5rem 0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>🏥</span>
          <div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              MediCitas
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#cbd5e1",
                margin: "0.25rem 0 0 0",
              }}
            >
              Sistema de gestión de citas médicas
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
