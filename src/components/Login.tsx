import { useState } from "react";

interface LoginProps {
  onLogin: (nombre: string, rol: "paciente" | "doctor", id?: number) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"paciente" | "doctor">("paciente");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!nombre.trim()) {
      setError("Por favor ingresa tu nombre");
      setIsLoading(false);
      return;
    }

    if (rol === "paciente" && !cedula.trim()) {
      setError("Por favor ingresa tu cédula");
      setIsLoading(false);
      return;
    }

    if (rol === "doctor" && !email.trim()) {
      setError("Por favor ingresa tu email");
      setIsLoading(false);
      return;
    }

    try {
      if (rol === "paciente") {
        // Guardar paciente en BD
        const res = await fetch("/api/pacientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cedula,
            nombre,
          }),
        });

        if (res.ok) {
          const { paciente } = await res.json();
          onLogin(nombre, rol, paciente.id);
        } else {
          setError("Error al guardar paciente");
        }
      } else {
        // Guardar doctor en BD
        const res = await fetch("/api/doctores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            email,
          }),
        });

        if (res.ok) {
          const { doctor } = await res.json();
          onLogin(nombre, rol, doctor.id);
        } else {
          setError("Error al guardar doctor");
        }
      }
    } catch (err) {
      setError("Error en la conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "0.5rem",
            }}
          >
            🏥
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            }}
          >
            MediCitas
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              marginTop: "0.5rem",
              margin: 0,
            }}
          >
            Sistema de gestión de citas médicas
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Rol primero */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: 600,
                color: "#1e293b",
                fontSize: "0.95rem",
              }}
            >
              Ingreso como:
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  border:
                    rol === "paciente"
                      ? "2px solid #3b82f6"
                      : "2px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: rol === "paciente" ? "#eff6ff" : "white",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <input
                  type="radio"
                  name="rol"
                  value="paciente"
                  checked={rol === "paciente"}
                  onChange={(e) => {
                    setRol(e.target.value as "paciente");
                    setEmail("");
                  }}
                  disabled={isLoading}
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                />
                <span style={{ fontWeight: 500, color: "#1e293b" }}>
                  👤 Paciente
                </span>
              </label>

              <label
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  border:
                    rol === "doctor"
                      ? "2px solid #3b82f6"
                      : "2px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: rol === "doctor" ? "#eff6ff" : "white",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <input
                  type="radio"
                  name="rol"
                  value="doctor"
                  checked={rol === "doctor"}
                  onChange={(e) => setRol(e.target.value as "doctor")}
                  disabled={isLoading}
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                />
                <span style={{ fontWeight: 500, color: "#1e293b" }}>
                  👨‍⚕️ Doctor
                </span>
              </label>
            </div>
          </div>

          {/* Cédula (solo para pacientes) */}
          {rol === "paciente" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  fontSize: "0.95rem",
                }}
              >
                Tu cédula
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => {
                  setCedula(e.target.value);
                  setError("");
                }}
                placeholder="Ej: 1234567890"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: error ? "2px solid #ef4444" : "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = error
                    ? "#ef4444"
                    : "#e2e8f0";
                }}
              />
            </div>
          )}

          {/* Nombre */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#1e293b",
                fontSize: "0.95rem",
              }}
            >
              Tu nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
              placeholder="Ej: Juan Pérez"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: error ? "2px solid #ef4444" : "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = error
                  ? "#ef4444"
                  : "#e2e8f0";
              }}
            />
          </div>

          {/* Email (solo para doctors) */}
          {rol === "doctor" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  fontSize: "0.95rem",
                }}
              >
                Tu email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Ej: doctor@hospital.com"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: error ? "2px solid #ef4444" : "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "#3b82f6";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = error
                    ? "#ef4444"
                    : "#e2e8f0";
                }}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "0.75rem",
                marginBottom: "1rem",
                backgroundColor: "#fee2e2",
                borderRadius: "6px",
                color: "#7f1d1d",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: isLoading ? "#cbd5e1" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#3b82f6";
              }
            }}
          >
            {isLoading ? "Cargando..." : "Continuar"}
          </button>
        </form>

        {/* Info */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            fontSize: "0.85rem",
            color: "#064e3b",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ display: "block", marginBottom: "0.25rem" }}>
            👤 Paciente:
          </strong>
          <p style={{ margin: "0 0 0.75rem 0" }}>
            Crea nuevas citas médicas y visualiza tu historial.
          </p>
          <strong style={{ display: "block", marginBottom: "0.25rem" }}>
            👨‍⚕️ Doctor:
          </strong>
          <p style={{ margin: 0 }}>
            Confirma o rechaza citas, gestiona tu agenda.
          </p>
        </div>
      </div>
    </div>
  );
}
