-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ExamBank" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FormulaBank" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MaterialBank" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "QuizOption" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "QuizReview" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Simulation" ALTER COLUMN "updated_at" DROP DEFAULT;
