-- CreateTable
CREATE TABLE "Jogador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,
    "timeAtual" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sinergia" INTEGER NOT NULL,
    "highlights" TEXT NOT NULL,
    "papel" TEXT NOT NULL,
    "estilo" TEXT NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);
