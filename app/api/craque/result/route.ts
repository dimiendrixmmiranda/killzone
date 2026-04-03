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

        if (!session) {
            return NextResponse.json([])
        }

        // 🔥 votos agrupados
        const votes = await prisma.playerVote.groupBy({
            by: ["playerId"],
            where: {
                sessionId: session.id
            },
            _count: {
                playerId: true
            }
        })

        // 🔥 transforma em mapa (facilita lookup)
        const voteMap = new Map(
            votes.map((v: any) => [v.playerId, v._count.playerId])
        )

        // 🔥 junta com TODOS jogadores
        const resultado = session.players.map((p: any) => ({
            playerId: p.player.id,
            votos: voteMap.get(p.player.id) || 0
        }))

        // 🔥 ordena
        resultado.sort((a: any, b: any) => b.votos - a.votos)

        return NextResponse.json(resultado)

    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar resultado" },
            { status: 500 }
        )
    }
}