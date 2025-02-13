/*
  Warnings:

  - The values [TRUE_FALSE,FILL_IN_THE_BLANK] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `correctAnswer` on the `Qna` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('SUBJECTIVE', 'MCQ');
ALTER TABLE "Qna" ALTER COLUMN "questionType" DROP DEFAULT;
ALTER TABLE "Qna" ALTER COLUMN "questionType" TYPE "QuestionType_new" USING ("questionType"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
ALTER TABLE "Qna" ALTER COLUMN "questionType" SET DEFAULT 'SUBJECTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Qna" DROP COLUMN "correctAnswer",
ADD COLUMN     "explanation" TEXT;
