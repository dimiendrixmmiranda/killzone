-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('RUMOR', 'CONFIRMADO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TransferTipo" AS ENUM ('TRANSFERENCIA', 'FREE_AGENT', 'BANCO', 'SAIDA');

-- CreateTable
CREATE TABLE "Transferencia" (
    "id" TEXT NOT NULL,
    "jogadorId" TEXT NOT NULL,
    "timeOrigemId" TEXT,
    "timeDestinoId" TEXT,
    "timeOrigemNome" TEXT,
    "timeDestinoNome" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "TransferStatus" NOT NULL,
    "tipo" "TransferTipo" NOT NULL,
    "valor" DOUBLE PRECISION,
    "moeda" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
