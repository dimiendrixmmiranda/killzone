import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const rankingId = searchParams.get("rankingId")

        if (!rankingId) {
            return NextResponse.json({ error: "rankingId obrigatório" }, { status: 400 })
        }

        const votes = await prisma.vote.findMany({
            where: { rankingId },
            include: {
                positions: true
            }
        })

        // 🧠 cálculo dos pontos
        const scoreMap: Record<string, number> = {}

        for (const vote of votes) {
            for (const pos of vote.positions) {
                const points = 11 - pos.position

                if (!scoreMap[pos.teamId]) {
                    scoreMap[pos.teamId] = 0
                }

                scoreMap[pos.teamId] += points
            }
        }

        // 🔥 transforma em array ordenado
        const rankingFinal = Object.entries(scoreMap)
            .map(([teamId, points]) => ({
                teamId,
                points
            }))
            .sort((a, b) => b.points - a.points)

        return NextResponse.json({ ranking: rankingFinal })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro ao calcular ranking" }, { status: 500 })
    }
}