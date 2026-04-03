// /api/craque/vote/route.ts

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const { userId, sessionId, playerId } = await req.json()

        if (!userId || !sessionId || !playerId) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        // 🚫 impede voto duplicado
        const existing = await prisma.playerVote.findUnique({
            where: {
                userId_sessionId: {
                    userId,
                    sessionId
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                { error: "Você já votou" },
                { status: 400 }
            )
        }

        const vote = await prisma.playerVote.create({
            data: {
                userId,
                sessionId,
                playerId
            }
        })

        return NextResponse.json(vote)

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Erro ao votar" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const vote = await prisma.playerVote.findUnique({
        where: {
            userId_sessionId: {
                userId,
                sessionId
            }
        }
    })

    return NextResponse.json({ voted: !!vote })
}