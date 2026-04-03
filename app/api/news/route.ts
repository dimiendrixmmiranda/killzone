import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ error: "não autorizado" }, { status: 401 })
        }

        const body = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return Response.json({ error: "usuário não encontrado" }, { status: 404 })
        }

        const news = await prisma.news.create({
            data: {
                slug: body.slug,
                titulo: body.titulo,
                resumo: body.resumo,
                autor: body.autor || '',
                thumbnail: body.thumbnail,
                conteudo: body.conteudo || [],
                sobreOJogo: body.sobreOJogo || [],
                timesRelacionados: body.timesRelacionados || [],
                partidaId: body.partidaId || '',
                jogoId: body.jogoId || '',
                tags: {
                    connectOrCreate: body.tags.map((tag: string) => ({
                        where: { nome: tag },
                        create: { nome: tag }
                    }))
                }
            }
        })
        console.log("CRIANDO NEWS COM SLUG:", body.slug)
        return Response.json(news)

    } catch (err: any) {
        console.log("ERRO REAL:", err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            include: {
                tags: true
            },
            orderBy: {
                dataPublicacao: 'desc'
            }
        })

        return Response.json(news)
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}