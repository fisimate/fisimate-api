-- DropForeignKey
ALTER TABLE "ExamBank" DROP CONSTRAINT "ExamBank_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "FormulaBank" DROP CONSTRAINT "FormulaBank_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "MaterialBank" DROP CONSTRAINT "MaterialBank_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_user_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizOption" DROP CONSTRAINT "QuizOption_question_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizReview" DROP CONSTRAINT "QuizReview_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Simulation" DROP CONSTRAINT "Simulation_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_quiz_attempt_id_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizResponse" DROP CONSTRAINT "UserQuizResponse_selectedOptionId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBank" ADD CONSTRAINT "ExamBank_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialBank" ADD CONSTRAINT "MaterialBank_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaBank" ADD CONSTRAINT "FormulaBank_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizReview" ADD CONSTRAINT "QuizReview_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_quiz_attempt_id_fkey" FOREIGN KEY ("quiz_attempt_id") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizResponse" ADD CONSTRAINT "UserQuizResponse_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuizOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
