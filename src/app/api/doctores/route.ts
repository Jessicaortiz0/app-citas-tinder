import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const doctores = await prisma.doctor.findMany();
    return NextResponse.json(doctores, { status: 200 });
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return NextResponse.json(
      { error: "Error al obtener doctores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email } = body;

    if (!nombre || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el doctor ya existe
    const doctorExistente = await prisma.doctor.findUnique({
      where: { email },
    });

    if (doctorExistente) {
      return NextResponse.json(
        { doctor: doctorExistente, nuevo: false },
        { status: 200 }
      );
    }

    // Crear nuevo doctor
    const doctor = await prisma.doctor.create({
      data: {
        nombre,
        email,
      },
    });

    return NextResponse.json(
      { doctor, nuevo: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear doctor:", error);
    return NextResponse.json(
      { error: "Error al crear doctor" },
      { status: 500 }
    );
  }
}
