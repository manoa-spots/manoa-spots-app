-- AlterTable
ALTER TABLE "Spot" ADD COLUMN     "currentBusyness" TEXT;

-- CreateIndex
CREATE INDEX "CheckIn_spotId_idx" ON "CheckIn"("spotId");

-- CreateIndex
CREATE INDEX "CheckIn_userId_idx" ON "CheckIn"("userId");
