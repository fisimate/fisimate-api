/*
  Warnings:

  - You are about to drop the column `icon` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `Simulation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "icon",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Simulation" DROP COLUMN "file_path";
