import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // ajuste pro seu caminho

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const { userId, campeonatoId, slots } = body

        if (!userId || !campeonatoId || !slots) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
        }

        // 🔥 validação simples
        const preenchidos = slots.filter((s: any) => s.timeId)
        if (preenchidos.length < 8) {
            return NextResponse.json({ error: "Pickem incompleto" }, { status: 400 })
        }

        const pickem = await prisma.pickem.upsert({
            where: {
                userId_campeonatoId: {
                    userId,
                    campeonatoId
                }
            },
            update: {
                picks: slots
            },
            create: {
                userId,
                campeonatoId,
                picks: slots
            }
        })

        return NextResponse.json(pickem)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get("userId")
    const campeonatoId = searchParams.get("campeonatoId")

    if (!userId) {
        return NextResponse.json({ error: "userId obrigatório" }, { status: 400 })
    }

    // 🔥 CASO 1: buscar específico (como já faz hoje)
    if (campeonatoId) {
        const pickem = await prisma.pickem.findUnique({
            where: {
                userId_campeonatoId: {
                    userId,
                    campeonatoId
                }
            }
        })

        return NextResponse.json(pickem)
    }

    // 🔥 CASO 2: buscar TODOS os pickems do usuário
    const pickems = await prisma.pickem.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc" // opcional, se tiver esse campo
        }
    })

    return NextResponse.json(pickems)
}