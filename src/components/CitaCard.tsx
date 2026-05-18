interface Paciente {
  id: number;
  nombre: string;
  email?: string;
}

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  estado: string;
  paciente: Paciente;
}

interface CitaCardProps {
  cita: Cita;
  onEliminar: (id: number) => void;
  onCambiarEstado: (id: number, estado: string) => void;
  isPaciente?: boolean;
}

export default function CitaCard({
  cita,
  onEliminar,
  onCambiarEstado,
}: CitaCardProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" };
      case "CANCELADA":
        return { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
      default:
        return { bg: "#fef9c3", text: "#713f12", border: "#fde047" };
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return "✓ Confirmada";
      case "CANCELADA":
        return "✕ Cancelada";
      default:
        return "⏱ Pendiente";
    }
  };

  const colors = getEstadoColor(cita.estado);
  const fecha = new Date(cita.fecha);
  const fechaFormato = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const horaFormato = fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `2px solid ${colors.border}`,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 6px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 0.5rem 0",
            }}
          >
            👤 {cita.paciente?.nombre || "Paciente desconocido"}
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#64748b",
              margin: "0 0 0.75rem 0",
              lineHeight: "1.5",
            }}
          >
            {cita.motivo}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            📅 {fechaFormato} a las {horaFormato}
          </p>
        </div>

        <div
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {getEstadoLabel(cita.estado)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {cita.estado !== "CONFIRMADA" && (
          <button
            onClick={() => onCambiarEstado(cita.id, "CONFIRMADA")}
            style={{
              padding: "0.6rem 1rem",
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
              (e.target as HTMLButtonElement).style.backgroundColor = "#a7f3d0";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#d1fae5";
            }}
          >
            ✓ Confirmar
          </button>
        )}

        {cita.estado !== "CANCELADA" && (
          <button
            onClick={() => onCambiarEstado(cita.id, "CANCELADA")}
            style={{
              padding: "0.6rem 1rem",
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
              (e.target as HTMLButtonElement).style.backgroundColor = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#fee2e2";
            }}
          >
            ✕ Cancelar
          </button>
        )}

        <button
          onClick={() => onEliminar(cita.id)}
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#f1f5f9",
            color: "#475569",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
          }}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}
