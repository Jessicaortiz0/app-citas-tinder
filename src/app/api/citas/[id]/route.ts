import { NextRequest, NextResponse } from "next/server";
import {
  obtenerCitaPorId,
  actualizarCita,
  eliminarCita,
} from "@/services/citasService";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cita = await obtenerCitaPorId(Number(id));
    if (!cita) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(cita, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener la cita" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cita = await actualizarCita(Number(id), body);
    return NextResponse.json(cita, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la cita" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await eliminarCita(Number(id));
    return NextResponse.json(
      { mensaje: "Cita eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la cita" },
      { status: 500 }
    );
  }
}