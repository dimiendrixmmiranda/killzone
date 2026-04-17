-- CreateTable
CREATE TABLE "Fantasy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campeonatoId" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fantasy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fantasy_userId_campeonatoId_key" ON "Fantasy"("userId", "campeonatoId");

-- AddForeignKey
ALTER TABLE "Fantasy" ADD CONSTRAINT "Fantasy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fantasy" ADD CONSTRAINT "Fantasy_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "Campeonato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
