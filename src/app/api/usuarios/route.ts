import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const userId = parseInt(id, 10);

    // Get all users except current one
    // In a real app we would exclude people already matched or swiped on
    const usuarios = await prisma.usuario.findMany({
      where: {
        id_usuario: {
          not: userId,
        },
      },
      include: {
        perfil: true,
        fotografias: true,
      },
      take: 20,
    });

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
