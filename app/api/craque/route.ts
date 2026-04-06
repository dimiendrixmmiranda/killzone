// /api/craque/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { title, date, players } = await req.json()

        if (!title || !date || !players || players.length !== 6) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        // 🚫 evita múltiplas sessões abertas
        const existing = await prisma.playerVoteSession.findFirst({
            where: { status: "OPEN" }
        })

        if (existing) {
            return NextResponse.json(
                { error: "Já existe uma votação ativa" },
                { status: 400 }
            )
        }

        const start = new Date(date)
        const end = new Date(date)

        end.setDate(end.getDate() + 7) // +7 dias, por exemplo

        const session = await prisma.playerVoteSession.create({
            data: {
                title,
                startDate: start,
                endDate: end,
                status: "OPEN",
                players: {
                    create: players.map((playerId: string) => ({
                        playerId
                    }))
                }
            }
        })

        return NextResponse.json(session)

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Erro ao criar votação" },
            { status: 500 }
        )
    }
}