import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, date, teams } = body

        // ✅ validação básica
        if (!title || !date || !teams || teams.length === 0) {
            return NextResponse.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        // ✅ garantir 10 times (ajusta se quiser outro número)
        if (teams.length !== 10) {
            return NextResponse.json(
                { error: "É necessário exatamente 10 times" },
                { status: 400 }
            )
        }

        // ✅ evitar duplicados
        const uniqueTeams = new Set(teams)
        if (uniqueTeams.size !== teams.length) {
            return NextResponse.json(
                { error: "Times duplicados" },
                { status: 400 }
            )
        }

        // ✅ impedir mais de um ranking aberto
        const existing = await prisma.ranking.findFirst({
            where: { status: "OPEN" }
        })

        if (existing) {
            return NextResponse.json(
                { error: "Já existe um ranking ativo" },
                { status: 400 }
            )
        }

        // 🧠 datas
        const startDate = new Date(date)

        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)

        // 🏆 criar ranking
        const ranking = await prisma.ranking.create({
            data: {
                title,
                startDate,
                endDate,
                status: "OPEN"
            }
        })

        // 🔗 vincular times
        await prisma.rankingTeam.createMany({
            data: teams.map((teamId: string) => ({
                rankingId: ranking.id,
                teamId
            }))
        })

        return NextResponse.json({
            success: true,
            rankingId: ranking.id
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}


export async function GET() {
    try {
        const ranking = await prisma.ranking.findFirst({
            where: {
                status: "OPEN"
            },
            include: {
                teams: true // se tiver relação
            }
        })

        if (!ranking) {
            return NextResponse.json(
                { error: "Nenhum ranking ativo" },
                { status: 404 }
            )
        }

        return NextResponse.json(ranking)

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Erro ao buscar ranking" },
            { status: 500 }
        )
    }
}