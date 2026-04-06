import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {
            jogadorId,
            timeOrigemId,
            timeDestinoId,
            data,
            status,
            tipo,
            valor,
            moeda,
            observacao
        } = body

        // 🔥 validações básicas
        if (!jogadorId) {
            return NextResponse.json(
                { error: "Jogador é obrigatório" },
                { status: 400 }
            )
        }

        if (!data) {
            return NextResponse.json(
                { error: "Data é obrigatória" },
                { status: 400 }
            )
        }

        const transferencia = await prisma.transferencia.create({
            data: {
                jogadorId,
                timeOrigemId: timeOrigemId || null,
                timeDestinoId: timeDestinoId || null,
                data: new Date(data),
                status,
                tipo,
                valor,
                moeda,
                observacao
            }
        })

        return NextResponse.json(transferencia)

    } catch (error) {
        console.error("Erro ao criar transferencia:", error)
        return NextResponse.json(
            { error: "Erro ao criar transferência" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const transferencias = await prisma.transferencia.findMany({
            include: {
                jogador: true
            },
            orderBy: {
                data: "desc"
            }
        })

        return NextResponse.json(transferencias)

    } catch (error) {
        console.error("Erro ao buscar transferencias:", error)
        return NextResponse.json(
            { error: "Erro ao buscar transferências" },
            { status: 500 }
        )
    }
}