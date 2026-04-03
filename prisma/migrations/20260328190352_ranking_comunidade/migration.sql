-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingTeam" (
    "id" TEXT NOT NULL,
    "rankingId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "RankingTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rankingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotePosition" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "VotePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingResult" (
    "id" TEXT NOT NULL,
    "rankingId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "finalPosition" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "RankingResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RankingTeam_rankingId_teamId_key" ON "RankingTeam"("rankingId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_rankingId_key" ON "Vote"("userId", "rankingId");

-- CreateIndex
CREATE UNIQUE INDEX "VotePosition_voteId_position_key" ON "VotePosition"("voteId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "RankingResult_rankingId_teamId_key" ON "RankingResult"("rankingId", "teamId");

-- AddForeignKey
ALTER TABLE "RankingTeam" ADD CONSTRAINT "RankingTeam_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotePosition" ADD CONSTRAINT "VotePosition_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingResult" ADD CONSTRAINT "RankingResult_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
