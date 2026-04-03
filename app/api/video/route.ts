import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const video = await prisma.video.create({
            data: {
                titulo: body.titulo,
                tipo: body.tipo,
                url: body.url,
                data: new Date(body.data)
            }
        })

        return NextResponse.json(video)
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Erro ao criar vídeo" },
            { status: 500 }
        )
    }
}


export async function GET() {
    const videos = await prisma.video.findMany({
        orderBy: {
            data: "desc"
        }
    })
    return NextResponse.json(videos)
}