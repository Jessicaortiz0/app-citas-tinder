import { prisma } from "@/lib/prisma";
import { Estado } from "@prisma/client";

export async function obtenerCitas() {
  return prisma.cita.findMany({
    include: { paciente: true },
    orderBy: { fecha: "asc" },
  });
}

export async function obtenerCitaPorId(id: number) {
  return prisma.cita.findUnique({
    where: { id },
    include: { paciente: true },
  });
}

export async function crearCita(data: {
  fecha: string;
  motivo: string;
  pacienteId: number;
}) {
  return prisma.cita.create({
    data: {
      fecha: new Date(data.fecha),
      motivo: data.motivo,
      pacienteId: data.pacienteId,
    },
    include: { paciente: true },
  });
}

export async function actualizarCita(
  id: number,
  data: { fecha?: string; motivo?: string; estado?: Estado }
) {
  return prisma.cita.update({
    where: { id },
    data: {
      ...(data.fecha && { fecha: new Date(data.fecha) }),
      ...(data.motivo && { motivo: data.motivo }),
      ...(data.estado && { estado: data.estado }),
    },
    include: { paciente: true },
  });
}

export async function eliminarCita(id: number) {
  return prisma.cita.delete({ where: { id } });
}