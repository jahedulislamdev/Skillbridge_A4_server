/*
  Warnings:

  - You are about to drop the `subjectCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TutorSubject" DROP CONSTRAINT "TutorSubject_categoryId_fkey";

-- DropTable
DROP TABLE "subjectCategories";

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TutorSubject" ADD CONSTRAINT "TutorSubject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
