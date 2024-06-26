/*
  Warnings:

  - You are about to drop the column `created_at` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_id` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserQuizResponse` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserQuizResponse` table. All the data in the column will be lost.
  - Added the required column `correctOption` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_attempt_id` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedOption` to the `UserQuizResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_question_id_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_user_id_fkey";

-- AlterTable
ALTER TABLE "UserQuizResponse" DROP COLUMN "created_at",
DROP COLUMN "question_id",
DROP COLUMN "quiz_id",
DROP COLUMN "score",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "correctOption" TEXT NOT NULL,
ADD COLUMN     "questionId" TEXT NOT NULL,
ADD COLUMN     "quiz_attempt_id" TEXT NOT NULL,
ADD COLUMN     "selectedOption" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "attempt_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamBank_chapter_id_idx" ON "ExamBank"("chapter_id");

-- CreateIndex
CREATE INDEX "FormulaBank_chapter_id_idx" ON "FormulaBank"("chapter_id");

-- CreateIndex
CREATE INDEX "Material_simulation_id_idx" ON "Material"("simulation_id");

-- CreateIndex
CREATE INDEX "MaterialBank_chapter_id_idx" ON "MaterialBank"("chapter_id");

-- CreateIndex
CREATE INDEX "Question_quiz_id_idx" ON "Question"("quiz_id");

-- CreateIndex
CREATE INDEX "Quiz_simulation_id_idx" ON "Quiz"("simulation_id");

-- CreateIndex
CREATE INDEX "QuizOption_question_id_idx" ON "QuizOption"("question_id");

-- CreateIndex
CREATE INDEX "QuizReview_quiz_id_idx" ON "QuizReview"("quiz_id");

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_idx" ON "RefreshToken"("user_id");

-- CreateIndex
CREATE INDEX "Simulation_chapter_id_idx" ON "Simulation"("chapter_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_quiz_attempt_id_fkey" FOREIGN KEY ("quiz_attempt_id") REFERENCES "QuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
