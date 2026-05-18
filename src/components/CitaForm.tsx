import { useState } from "react";

interface CitaFormProps {
  onSubmit: (formData: {
    fecha: string;
    motivo: string;
  }) => void;
  onCancel: () => void;
}

export default function CitaForm({ onSubmit, onCancel }: CitaFormProps) {
  const [formData, setFormData] = useState({
    fecha: "",
    motivo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    }
    if (!formData.motivo) {
      newErrors.motivo = "El motivo es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1.25rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1e293b",
          }}
        >
          Fecha y hora
        </label>
        <input
          type="datetime-local"
          value={formData.fecha}
          onChange={(e) =>
            setFormData({ ...formData, fecha: e.target.value })
          }
          style={{
            ...(inputStyle as React.CSSProperties),
            borderColor: errors.fecha ? "#ef4444" : "#e2e8f0",
          }}
        />
        {errors.fecha && (
          <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem", margin: 0 }}>
            {errors.fecha}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "1.75rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1e293b",
          }}
        >
          Motivo de la cita
        </label>
        <textarea
          value={formData.motivo}
          onChange={(e) =>
            setFormData({ ...formData, motivo: e.target.value })
          }
          placeholder="Ej: Revisión general, Dolor de cabeza..."
          style={{
            ...(inputStyle as React.CSSProperties),
            borderColor: errors.motivo ? "#ef4444" : "#e2e8f0",
            minHeight: "100px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        {errors.motivo && (
          <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem", margin: 0 }}>
            {errors.motivo}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#2563eb";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#3b82f6";
          }}
        >
          Crear cita
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#f1f5f9",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
