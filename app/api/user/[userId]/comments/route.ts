import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await context.params

        if (!userId) {
            return NextResponse.json(
                { error: "userId obrigatório" },
                { status: 400 }
            )
        }

        const comentarios = await prisma.comment.findMany({
            where: {
                userId
            },
            include: {
                user: true,
                news: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(comentarios)

    } catch (error) {
        console.error("ERRO:", error)

        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        )
    }
}