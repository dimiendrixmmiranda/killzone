import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        console.log("SESSION:", session)

        if (!session?.user?.email) {
            return Response.json({ error: "não logado" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        console.log("USER:", user)

        return Response.json(user)
    } catch (err: any) {
        console.log("ERRO REAL:", err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}