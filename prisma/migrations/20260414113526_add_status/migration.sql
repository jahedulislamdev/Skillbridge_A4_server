-- CreateEnum
CREATE TYPE "TutomStatus" AS ENUM ('APPROVED', 'PENDING');

-- AlterTable
ALTER TABLE "tutorsprofile" ADD COLUMN     "status" "TutomStatus" NOT NULL DEFAULT 'PENDING';
