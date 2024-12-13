/*
  Warnings:

  - Added the required column `busyness` to the `CheckIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CheckIn_spotId_idx";

-- DropIndex
DROP INDEX "CheckIn_userId_idx";

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "busyness" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT;
