/*
  Warnings:

  - You are about to drop the `ConversationHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `snapShotKey` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "messageType" ADD VALUE 'TOOL_RESULT';

-- DropForeignKey
ALTER TABLE "ConversationHistory" DROP CONSTRAINT "ConversationHistory_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "snapShotKey" TEXT NOT NULL;

-- DropTable
DROP TABLE "ConversationHistory";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "messageType" NOT NULL,
    "from" "senderType" NOT NULL,
    "contents" TEXT NOT NULL,
    "toolCall" "toolType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
