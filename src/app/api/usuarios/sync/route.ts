import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, nombre, authId } = await request.json();

    if (!email || !authId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Check if user already exists
    let contacto = await prisma.contacto.findUnique({
      where: { correo: email },
      include: { usuario: true }
    });

    if (!contacto) {
      // Create new Usuario and Contacto
      const newUsuario = await prisma.usuario.create({
        data: {
          nombre: nombre || "Nuevo Usuario",
          edad: 25,
          genero: "No especificado",
          nacionalidad: "Local",
          ciudad_pais: "Ciudad",
          contacto: {
            create: {
              correo: email
            }
          },
          perfil: {
            create: {
              biografia: "¡Hola! Soy nuevo aquí."
            }
          }
        },
        include: {
          contacto: true,
          perfil: true,
        }
      });
      return NextResponse.json({ success: true, usuario: newUsuario }, { status: 201 });
    }

    return NextResponse.json({ success: true, usuario: contacto.usuario }, { status: 200 });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
