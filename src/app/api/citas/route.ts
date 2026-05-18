import { NextRequest, NextResponse } from "next/server";
import { obtenerCitas, crearCita } from "@/services/citasService";

export async function GET() {
  try {
    const citas = await obtenerCitas();
    return NextResponse.json(citas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fecha, motivo, pacienteId } = body;

    if (!fecha || !motivo || !pacienteId) {
      return NextResponse.json(
        { error: "Faltan campos: fecha, motivo, pacienteId" },
        { status: 400 }
      );
    }

    const cita = await crearCita({ fecha, motivo, pacienteId });
    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear la cita" },
      { status: 500 }
    );
  }
}