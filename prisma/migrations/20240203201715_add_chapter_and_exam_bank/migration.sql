-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamBank" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,

    CONSTRAINT "ExamBank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExamBank" ADD CONSTRAINT "ExamBank_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
