import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
    const session = await getServerSession()

    if (!session?.user?.email) {
        return Response.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { campeonatoId, slots } = body

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        return Response.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // 🔥 UPSERT (cria ou atualiza)
    const fantasy = await prisma.fantasy.upsert({
        where: {
            userId_campeonatoId: {
                userId: user.id,
                campeonatoId
            }
        },
        update: {
            slots
        },
        create: {
            userId: user.id,
            campeonatoId,
            slots
        }
    })

    return Response.json(fantasy)
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const campeonatoId = searchParams.get("campeonatoId")

    const session = await getServerSession()

    if (!session?.user?.email) {
        return Response.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        return Response.json({ error: "Usuário não encontrado" })
    }

    // 🔥 SE NÃO VIER campeonatoId → retorna TODOS
    if (!campeonatoId) {
        const fantasys = await prisma.fantasy.findMany({
            where: {
                userId: user.id
            }
        })

        return Response.json(fantasys)
    }

    // 🔥 SE VIER → retorna específico
    const fantasy = await prisma.fantasy.findUnique({
        where: {
            userId_campeonatoId: {
                userId: user.id,
                campeonatoId
            }
        }
    })

    return Response.json(fantasy)
}