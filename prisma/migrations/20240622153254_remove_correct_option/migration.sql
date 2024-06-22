/*
  Warnings:

  - You are about to drop the column `correctOption` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `selectedOption` on the `UserQuizResponse` table. All the data in the column will be lost.
  - Added the required column `selectedOptionId` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserQuizResponse" DROP COLUMN "correctOption",
DROP COLUMN "selectedOption",
ADD COLUMN     "selectedOptionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuizOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
