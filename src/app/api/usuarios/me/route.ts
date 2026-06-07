import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const contacto = await prisma.contacto.findUnique({
      where: { correo: email },
      include: {
        usuario: {
          include: {
            perfil: true,
            fotografias: true,
          }
        }
      }
    });

    if (!contacto) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(contacto.usuario, { status: 200 });
  } catch (error) {
    console.error("Error fetching me:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
