import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const pacientes = await prisma.paciente.findMany();
    return NextResponse.json(pacientes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return NextResponse.json(
      { error: "Error al obtener pacientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cedula, nombre, email } = body;

    if (!cedula || !nombre) {
      return NextResponse.json(
        { error: "Cédula y nombre son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el paciente ya existe por cédula
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { cedula },
    });

    if (pacienteExistente) {
      return NextResponse.json(
        { paciente: pacienteExistente, nuevo: false },
        { status: 200 }
      );
    }

    // Crear nuevo paciente
    const paciente = await prisma.paciente.create({
      data: {
        cedula,
        nombre,
        email: email || `${cedula}@paciente.local`,
      },
    });

    return NextResponse.json(
      { paciente, nuevo: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear paciente:", error);
    return NextResponse.json(
      { error: "Error al crear paciente" },
      { status: 500 }
    );
  }
}
