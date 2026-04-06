/*
  Warnings:

  - You are about to drop the column `timeDestinoNome` on the `Transferencia` table. All the data in the column will be lost.
  - You are about to drop the column `timeOrigemNome` on the `Transferencia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transferencia" DROP COLUMN "timeDestinoNome",
DROP COLUMN "timeOrigemNome";
