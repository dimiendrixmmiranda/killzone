import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // 1️⃣ tenta OPEN
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

        // 2️⃣ se não tiver OPEN → pega última CLOSED
        if (!session) {
            session = await prisma.playerVoteSession.findFirst({
                where: { status: "CLOSED" },
                orderBy: {
                    endDate: "desc"
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

        // 3️⃣ se não tiver nada mesmo
        if (!session) {
            return NextResponse.json([])
        }

        // 4️⃣ pega votos dessa sessão
        const votes = await prisma.playerVote.groupBy({
            by: ["playerId"],
            where: {
                sessionId: session.id
            },
            _count: {
                playerId: true
            }
        })

        const voteMap = new Map(
            votes.map((v: any) => [v.playerId, v._count.playerId])
        )

        // 5️⃣ monta resultado
        const resultado = session.players.map((p: any) => ({
            playerId: p.player.id,
            votos: voteMap.get(p.player.id) || 0
        }))

        // 6️⃣ ordena
        resultado.sort((a: any, b: any) => b.votos - a.votos)

        return NextResponse.json(resultado)

    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar resultado" },
            { status: 500 }
        )
    }
}