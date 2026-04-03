// /api/craque/active/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await prisma.playerVoteSession.findFirst({
            where: { status: "OPEN" },
            include: {
                players: {
                    include: {
                        player: true
                    }
                }
            }
        })

        return NextResponse.json(session)

    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar votação" },
            { status: 500 }
        )
    }
}