/*
  Warnings:

  - You are about to drop the `TutorCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TutorCategory" DROP CONSTRAINT "TutorCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TutorCategory" DROP CONSTRAINT "TutorCategory_tutorId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "TutorCategory";

-- CreateTable
CREATE TABLE "TutorSubject" (
    "tutorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TutorSubject_pkey" PRIMARY KEY ("tutorId","categoryId")
);

-- AddForeignKey
ALTER TABLE "TutorSubject" ADD CONSTRAINT "TutorSubject_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutorsprofile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorSubject" ADD CONSTRAINT "TutorSubject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "subjectCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
