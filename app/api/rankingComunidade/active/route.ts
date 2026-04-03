import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const ranking = await prisma.ranking.findFirst({
            where: {
                status: "OPEN"
            },
            include: {
                teams: true
            }
        })

        if (!ranking) {
            return NextResponse.json({ error: "Nenhum ranking ativo" }, { status: 404 })
        }

        return NextResponse.json({
            id: ranking.id,
            title: ranking.title,
            teams: ranking.teams.map((t: { teamId: string }) => t.teamId)
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Erro ao buscar ranking" },
            { status: 500 }
        )
    }
}