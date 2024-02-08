-- CreateTable
CREATE TABLE "MaterialBank" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialBank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaterialBank" ADD CONSTRAINT "MaterialBank_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
