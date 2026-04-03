import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import bcrypt from "bcrypt"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ error: "não autorizado" }, { status: 401 })
        }

        const { senhaAtual, novaSenha } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user || !user.password) {
            return Response.json({ error: "usuário inválido" }, { status: 400 })
        }

        const senhaValida = await bcrypt.compare(senhaAtual, user.password)

        if (!senhaValida) {
            return Response.json({ error: "senha atual incorreta" }, { status: 400 })
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10)

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                password: novaSenhaHash
            }
        })

        return Response.json({ success: true })

    } catch (err) {
        console.log(err)
        return Response.json({ error: "erro ao alterar senha" }, { status: 500 })
    }
}