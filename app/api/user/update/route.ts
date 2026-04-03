import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return Response.json({ error: "não autorizado" }, { status: 401 })
        }


        const { name, email, phone, nickname, image } = await req.json()

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(image !== undefined && { image }),
                ...(nickname !== undefined && { nickname }),
            }
        })

        return Response.json(updatedUser)
    } catch (err) {
        console.log(err)
        return Response.json({ error: "erro ao atualizar" }, { status: 500 })
    }
}