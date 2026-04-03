/*
  Warnings:

  - Added the required column `slugId` to the `Campeonato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campeonato" ADD COLUMN     "slugId" TEXT NOT NULL;
