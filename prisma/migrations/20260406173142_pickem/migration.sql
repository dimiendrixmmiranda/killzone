-- CreateTable
CREATE TABLE "Pickem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campeonatoId" TEXT NOT NULL,
    "picks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pickem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pickem_userId_campeonatoId_key" ON "Pickem"("userId", "campeonatoId");

-- AddForeignKey
ALTER TABLE "Pickem" ADD CONSTRAINT "Pickem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pickem" ADD CONSTRAINT "Pickem_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "Campeonato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
