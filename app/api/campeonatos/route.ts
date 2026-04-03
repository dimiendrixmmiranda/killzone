import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()

    const campeonato = await prisma.campeonato.create({
        data: {
            nome: body.nome,
            jogoId: body.jogoId,
            tipo: body.tipo,
            tier: body.tier,
            organizador: body.organizador,
            slugId: body.slugId,

            inicio: new Date(body.inicio),
            fim: new Date(body.fim),
            local: body.local,

            imagem: body.imagem,
            trofeu: body.trofeu,

            formato: body.formato,
            terceiroLugar: body.terceiroLugar,

            timesIds: body.timesIds,
            campeonatosRelacionados: body.campeonatosRelacionados,
            premiacoes: body.premiacoes,
            mvp: body.mvp || null
        }
    })

    return NextResponse.json(campeonato)
}


export async function GET() {
    const campeonatos = await prisma.campeonato.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return NextResponse.json(campeonatos)
}