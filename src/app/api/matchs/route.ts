import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    
    const userId = parseInt(id, 10);

    const matches1 = await prisma.matchs.findMany({
      where: { usuario1_id: userId, activo: true },
      include: { usuario2: { include: { fotografias: true } } },
    });

    const matches2 = await prisma.matchs.findMany({
      where: { usuario2_id: userId, activo: true },
      include: { usuario1: { include: { fotografias: true } } },
    });

    // Format so the 'other user' is always mapped to 'usuario2' for the frontend
    const formattedMatches = [
      ...matches1.map((m: any) => ({ ...m })),
      ...matches2.map((m: any) => ({
        id_match: m.id_match,
        usuario1_id: m.usuario1_id,
        usuario2_id: m.usuario2_id,
        activo: m.activo,
        usuario2: m.usuario1, // swap
      }))
    ];

    return NextResponse.json(formattedMatches, { status: 200 });
  } catch (error) {
    console.error("GET matches error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, targetId } = await request.json();

    if (!userId || !targetId) {
      return NextResponse.json({ error: "IDs requeridos" }, { status: 400 });
    }

    // For the MVP, every right swipe is an instant match!
    const existing = await prisma.matchs.findFirst({
      where: {
        OR: [
          { usuario1_id: userId, usuario2_id: targetId },
          { usuario1_id: targetId, usuario2_id: userId },
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ isMatch: true, newMatch: existing }, { status: 200 });
    }

    const newMatch = await prisma.matchs.create({
      data: {
        usuario1_id: userId,
        usuario2_id: targetId,
      },
      include: {
        usuario2: { include: { fotografias: true } }
      }
    });

    return NextResponse.json({ isMatch: true, newMatch }, { status: 201 });
  } catch (error) {
    console.error("POST match error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
