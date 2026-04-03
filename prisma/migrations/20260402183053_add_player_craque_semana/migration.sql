-- CreateTable
CREATE TABLE "PlayerVoteSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerVoteSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerVoteOption" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "PlayerVoteOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerVoteOption_sessionId_playerId_key" ON "PlayerVoteOption"("sessionId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerVote_userId_sessionId_key" ON "PlayerVote"("userId", "sessionId");

-- AddForeignKey
ALTER TABLE "PlayerVoteOption" ADD CONSTRAINT "PlayerVoteOption_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PlayerVoteSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerVoteOption" ADD CONSTRAINT "PlayerVoteOption_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerVote" ADD CONSTRAINT "PlayerVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerVote" ADD CONSTRAINT "PlayerVote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PlayerVoteSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerVote" ADD CONSTRAINT "PlayerVote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
