import { useState, useEffect } from "react";
import Modal from "./Modal";
import CitaForm from "./CitaForm";
import CitaCard from "./CitaCard";

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

interface PacienteViewProps {
  nombre: string;
  pacienteId?: number;
  onLogout: () => void;
}

export default function PacienteView({ nombre, pacienteId, onLogout }: PacienteViewProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const crearCita = async (formData: {
    fecha: string;
    motivo: string;
  }) => {
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: formData.fecha,
          motivo: formData.motivo,
          pacienteId: pacienteId || 1,
        }),
      });

      if (res.ok) {
        setMensaje("✓ Cita creada correctamente");
        setTipoMensaje("success");
        setIsModalOpen(false);
        cargarCitas();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("✗ Error al crear la cita");
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("✗ Error en la conexión");
      setTipoMensaje("error");
    }
  };

  const eliminarCita = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      try {
        const res = await fetch(`/api/citas/${id}`, { method: "DELETE" });
        if (res.ok) {
          setMensaje("✓ Cita eliminada");
          setTipoMensaje("success");
          cargarCitas();
          setTimeout(() => setMensaje(""), 3000);
        }
      } catch (error) {
        setMensaje("✗ Error al eliminar");
        setTipoMensaje("error");
      }
    }
  };

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
            <span style={{ fontSize: "2rem" }}>👤</span>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {nombre}
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                  margin: "0.25rem 0 0 0",
                }}
              >
                Paciente
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

        {/* Contenido */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "2rem",
          }}
        >
          {/* Panel lateral */}
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#2563eb";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#3b82f6";
              }}
            >
              + Nueva cita
            </button>

            {/* Estadísticas */}
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Mis citas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Total
                  </span>
                  <strong style={{ color: "#3b82f6" }}>{citas.length}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f0fdf4",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Confirmadas
                  </span>
                  <strong style={{ color: "#10b981" }}>
                    {citas.filter((c) => c.estado === "CONFIRMADA").length}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#fefce8",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Pendientes
                  </span>
                  <strong style={{ color: "#eab308" }}>
                    {citas.filter((c) => c.estado === "PENDIENTE").length}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de citas */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1.5rem",
              }}
            >
              Mis citas médicas
            </h2>

            {citas.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 2rem",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  📅 No hay citas registradas
                </p>
                <p style={{ color: "#cbd5e1", fontSize: "0.875rem", margin: 0 }}>
                  Haz clic en "Nueva cita" para crear la primera
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {citas.map((cita) => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    onEliminar={eliminarCita}
                    onCambiarEstado={() => {}}
                    isPaciente={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear nueva cita"
      >
        <CitaForm onSubmit={crearCita} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
