import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // 1️⃣ tenta pegar ranking aberto
        let ranking = await prisma.ranking.findFirst({
            where: {
                status: "OPEN"
            },
            include: {
                teams: true
            }
        })

        // 2️⃣ se não tiver, pega o último fechado
        if (!ranking) {
            ranking = await prisma.ranking.findFirst({
                where: {
                    status: "CLOSED"
                },
                orderBy: {
                    endDate: "desc" // 🔥 o mais recente
                },
                include: {
                    teams: true
                }
            })

            // ainda pode não existir nada
            if (!ranking) {
                return NextResponse.json(
                    { error: "Nenhum ranking encontrado" },
                    { status: 404 }
                )
            }

            // 👇 retorna indicando que está fechado
            return NextResponse.json({
                id: ranking.id,
                title: ranking.title,
                status: "CLOSED",
                startDate: ranking.startDate, // ✅ aqui também
                endDate: ranking.endDate,     // ✅ aqui também
                teams: ranking.teams.map((t: { teamId: string }) => t.teamId)
            })
        }

        // 3️⃣ caso OPEN normal
        return NextResponse.json({
            id: ranking.id,
            title: ranking.title,
            status: "OPEN",
            startDate: ranking.startDate, // ✅ aqui
            endDate: ranking.endDate,     // ✅ aqui
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