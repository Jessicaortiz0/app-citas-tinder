import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }

    // Buscar o crear usuario (Mock login)
    let usuario = await prisma.usuario.findFirst({
      where: { nombre },
      include: {
        perfil: true,
        fotografias: true,
      }
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nombre,
          edad: 25,
          genero: "No especificado",
          nacionalidad: "Local",
          ciudad_pais: "Ciudad",
        },
        include: {
          perfil: true,
          fotografias: true,
        }
      });
    }

    return NextResponse.json({ usuario }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
