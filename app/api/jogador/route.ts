import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()

    const jogador = await prisma.jogador.create({
        data: {
            nome: body.nome,
            idade: body.idade,
            apelido: body.apelido,
            pais: body.pais,
            categoria: body.categoria,
            imagem: body.imagem,
            jogoId: body.jogoId,
            timeAtual: body.timeAtual,
            status: body.status,
            sinergia: body.sinergia,
            highlights: body.highlights,
            papel: body.papel,
            estilo: body.estilo,
        }
    })
    return NextResponse.json(jogador)
}

export async function GET() {
    const jogador = await prisma.jogador.findMany()

    return NextResponse.json(jogador)
}