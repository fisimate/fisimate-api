/*
  Warnings:

  - Added the required column `question_id` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserQuizResponse" ADD COLUMN     "question_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
