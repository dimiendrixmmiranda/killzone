import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    const comments = await prisma.comment.findMany({
        where: {
            newsId: id
        },
        include: {
            user: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return Response.json(comments)
}

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()

        if (!body.content || !body.userId) {
            return Response.json(
                { error: "Dados inválidos" },
                { status: 400 }
            )
        }

        const comment = await prisma.comment.create({
            data: {
                content: body.content,
                userId: body.userId,
                newsId: id
            },
            include: {
                user: true
            }
        })

        return Response.json(comment)
    } catch (error) {
        console.error(error)

        return Response.json(
            { error: "Erro ao criar comentário" },
            { status: 500 }
        )
    }
}