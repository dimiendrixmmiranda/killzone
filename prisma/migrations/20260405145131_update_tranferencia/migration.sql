/*
  Warnings:

  - The values [CONFIRMADO,PENDENTE] on the enum `TransferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransferStatus_new" AS ENUM ('RUMOR', 'FECHADO', 'FALTA_ASSINAR');
ALTER TABLE "Transferencia" ALTER COLUMN "status" TYPE "TransferStatus_new" USING ("status"::text::"TransferStatus_new");
ALTER TYPE "TransferStatus" RENAME TO "TransferStatus_old";
ALTER TYPE "TransferStatus_new" RENAME TO "TransferStatus";
DROP TYPE "public"."TransferStatus_old";
COMMIT;
