// /api/craque/active/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // 1. tenta pegar OPEN
        let session = await prisma.playerVoteSession.findFirst({
            where: { status: "OPEN" },
            include: {
                players: {
                    include: {
                        player: true
                    }
                }
            }
        })

        // 2. se NÃO tiver OPEN → pega o último CLOSED
        if (!session) {
            session = await prisma.playerVoteSession.findFirst({
                where: { status: "CLOSED" },
                orderBy: {
                    endDate: "desc" // 🔥 pega o mais recente
                },
                include: {
                    players: {
                        include: {
                            player: true
                        }
                    }
                }
            })
        }

        return NextResponse.json(session)

    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar votação" },
            { status: 500 }
        )
    }
}