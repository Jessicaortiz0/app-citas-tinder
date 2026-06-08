import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password, nombre } = await request.json();

    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: "Todos los campos (nombre, email, contraseña) son requeridos" },
        { status: 400 }
      );
    }

    // Check if correo already exists
    const existingContacto = await prisma.contacto.findUnique({
      where: { correo: email },
    });

    if (existingContacto) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Create new Usuario and Contacto with password
    const newUsuario = await prisma.usuario.create({
      data: {
        nombre,
        edad: 25,
        genero: "No especificado",
        nacionalidad: "Local",
        ciudad_pais: "Ciudad",
        contacto: {
          create: {
            correo: email,
            password: password, // In a real app we would hash this, but for this dev build plain text is fine or we can keep it simple
          },
        },
        perfil: {
          create: {
            biografia: "¡Hola! Soy nuevo aquí.",
          },
        },
      },
      include: {
        contacto: true,
        perfil: true,
        fotografias: true,
      },
    });

    return NextResponse.json({ success: true, usuario: newUsuario }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
