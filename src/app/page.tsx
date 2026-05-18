"use client";
import { useEffect, useState } from "react";
import Login from "@/components/Login";
import PacienteView from "@/components/PacienteView";
import DoctorView from "@/components/DoctorView";

type Usuario = {
  nombre: string;
  rol: "paciente" | "doctor";
  id?: number;
} | null;

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Restaurar usuario del localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error("Error al restaurar usuario:", error);
      }
    }
  }, []);

  const handleLogin = (
    nombre: string,
    rol: "paciente" | "doctor",
    id?: number
  ) => {
    const nuevoUsuario: Usuario = { nombre, rol, id };
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  if (!mounted) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  if (usuario.rol === "paciente") {
    return (
      <PacienteView 
        nombre={usuario.nombre}
        pacienteId={usuario.id} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <DoctorView
      nombre={usuario.nombre}
      doctorId={usuario.id}
      onLogout={handleLogout}
    />
  );
}