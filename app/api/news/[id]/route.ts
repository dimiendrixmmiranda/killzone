import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        if (!id) {
            return Response.json({ error: "id não veio 😭" }, { status: 400 })
        }

        console.log("ID:", id)

        const news = await prisma.news.findUnique({
            where: { slug: id }, // mantém slug no banco se for o caso
            include: {
                tags: true,
                comentarios: {
                    include: { user: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!news) {
            return Response.json({ error: "notícia não encontrada 😭" }, { status: 404 })
        }

        return Response.json(news)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}