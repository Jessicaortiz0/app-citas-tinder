import { useState, useEffect } from "react";

interface Paciente {
  id: number;
  nombre: string;
  email: string;
}

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  estado: string;
  paciente: Paciente;
}

interface DoctorViewProps {
  nombre: string;
  doctorId?: number;
  onLogout: () => void;
}

export default function DoctorView({ nombre, onLogout }: DoctorViewProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");

  const cargarCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        setMensaje(
          estado === "CONFIRMADA"
            ? "✓ Cita confirmada"
            : "✕ Cita rechazada"
        );
        setTipoMensaje("success");
        cargarCitas();
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (error) {
      setMensaje("✗ Error al actualizar");
      setTipoMensaje("error");
    }
  };

  const pendientes = citas.filter((c) => c.estado === "PENDIENTE");
  const confirmadas = citas.filter((c) => c.estado === "CONFIRMADA");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          padding: "1.5rem 0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2rem" }}>👨‍⚕️</span>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                Dr. {nombre}
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                  margin: "0.25rem 0 0 0",
                }}
              >
                Médico
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "#dc2626";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "#ef4444";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Mensaje */}
        {mensaje && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "8px",
              backgroundColor:
                tipoMensaje === "success" ? "#d1fae5" : "#fee2e2",
              borderLeft: `4px solid ${
                tipoMensaje === "success" ? "#10b981" : "#ef4444"
              }`,
              color: tipoMensaje === "success" ? "#065f46" : "#7f1d1d",
            }}
          >
            {mensaje}
          </div>
        )}

        {/* Grid de dos columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Citas Pendientes */}
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#f59e0b",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}
            >
              ⏱ Por revisar
              <span
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {pendientes.length}
              </span>
            </h2>

            {pendientes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.95rem",
                    margin: 0,
                  }}
                >
                  ✓ Sin citas pendientes
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {pendientes.map((cita) => (
                  <div
                    key={cita.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      border: "2px solid #fef3c7",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      👤 {cita.paciente?.nombre}
                    </p>
                    <p
                      style={{
                        color: "#64748b",
                        margin: "0 0 0.75rem 0",
                        fontSize: "0.95rem",
                      }}
                    >
                      {cita.motivo}
                    </p>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        margin: "0 0 1rem 0",
                      }}
                    >
                      📅{" "}
                      {new Date(cita.fecha).toLocaleString("es-ES", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          cambiarEstado(cita.id, "CONFIRMADA")
                        }
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          backgroundColor: "#d1fae5",
                          color: "#065f46",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            "#a7f3d0";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            "#d1fae5";
                        }}
                      >
                        ✓ Confirmar
                      </button>
                      <button
                        onClick={() =>
                          cambiarEstado(cita.id, "CANCELADA")
                        }
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          backgroundColor: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            "#fca5a5";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            "#fee2e2";
                        }}
                      >
                        ✕ Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Citas Confirmadas */}
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#10b981",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}
            >
              ✓ Confirmadas
              <span
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {confirmadas.length}
              </span>
            </h2>

            {confirmadas.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.95rem",
                    margin: 0,
                  }}
                >
                  Sin citas confirmadas aún
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {confirmadas.map((cita) => (
                  <div
                    key={cita.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      border: "2px solid #d1fae5",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      👤 {cita.paciente?.nombre}
                    </p>
                    <p
                      style={{
                        color: "#64748b",
                        margin: "0 0 0.75rem 0",
                        fontSize: "0.95rem",
                      }}
                    >
                      {cita.motivo}
                    </p>
                    <p
                      style={{
                        color: "#10b981",
                        fontSize: "0.85rem",
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      📅{" "}
                      {new Date(cita.fecha).toLocaleString("es-ES", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
