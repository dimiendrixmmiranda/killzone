import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        // 🔐 sessão do usuário (FONTE REAL DO USER ID)
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // 📦 body da requisição
        const body = await req.json()
        const { rankingId, positions } = body

        // 🔐 validação básica
        if (!rankingId || !positions || positions.length === 0) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        // 🔥 garante que tem exatamente 10 posições
        if (positions.length !== 10) {
            return NextResponse.json(
                { error: "Ranking incompleto" },
                { status: 400 }
            )
        }

        // 🔥 verifica se já votou
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_rankingId: {
                    userId,
                    rankingId
                }
            }
        })

        if (existingVote) {
            return NextResponse.json(
                { error: "Usuário já votou" },
                { status: 400 }
            )
        }

        // 🗳️ cria voto + posições (JUNTO)
        await prisma.vote.create({
            data: {
                userId,
                rankingId,
                positions: {
                    create: positions.map((p: any) => ({
                        teamId: p.teamId,
                        position: p.position
                    }))
                }
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("ERRO AO VOTAR:", error)

        return NextResponse.json(
            { error: "Erro ao votar" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const rankingId = searchParams.get("rankingId")

        if (!rankingId) {
            return NextResponse.json({ voted: false })
        }

        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ voted: false })
        }

        const userId = session.user.id

        const vote = await prisma.vote.findUnique({
            where: {
                userId_rankingId: {
                    userId,
                    rankingId
                }
            }
        })

        return NextResponse.json({
            voted: !!vote
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ voted: false }, { status: 500 })
    }
}