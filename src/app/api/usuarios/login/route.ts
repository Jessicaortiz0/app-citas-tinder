import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    // Find the contacto record and include the usuario relations
    const contacto = await prisma.contacto.findUnique({
      where: { correo: email },
      include: {
        usuario: {
          include: {
            perfil: true,
            fotografias: true,
          },
        },
      },
    });

    if (!contacto || contacto.password !== password) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    return NextResponse.json({ success: true, usuario: contacto.usuario }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
