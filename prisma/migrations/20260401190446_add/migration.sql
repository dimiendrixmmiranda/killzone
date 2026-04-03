/*
  Warnings:

  - Added the required column `idade` to the `Jogador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jogador" ADD COLUMN     "idade" TEXT NOT NULL;
