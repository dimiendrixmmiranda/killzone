// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//   const id = "cmo7k04qo000guh6ov3zu1gsx" // COLOCA O ID AQUI

//   console.log("Tentando deletar:", id)

//   const exists = await prisma.news.findUnique({
//     where: { id }
//   })

//   console.log("Existe?", exists)

//   await prisma.news.delete({
//     where: { id }
//   })

//   console.log("Deletado com sucesso")
// }

// main()
//   .catch((e) => {
//     console.error("ERRO REAL:", e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })