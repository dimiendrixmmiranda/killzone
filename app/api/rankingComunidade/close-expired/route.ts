import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const now = new Date()

        const result = await prisma.ranking.updateMany({
            where: {
                status: "OPEN",
                endDate: {
                    lt: now
                }
            },
            data: {
                status: "CLOSED"
            }
        })

        return NextResponse.json({
            message: "Sessões encerradas",
            updated: result.count
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao encerrar sessões" },
            { status: 500 }
        )
    }
}