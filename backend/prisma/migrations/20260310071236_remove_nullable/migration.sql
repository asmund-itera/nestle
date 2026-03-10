/*
  Warnings:

  - Made the column `game-run` on table `game-run-guesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `word` on table `game-run-guesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `word` on table `games` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "game-run-guesses" DROP CONSTRAINT "game-run-guesses_game-run_fkey";

-- DropForeignKey
ALTER TABLE "game-run-guesses" DROP CONSTRAINT "game-run-guesses_word_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_word_fkey";

-- AlterTable
ALTER TABLE "game-run-guesses" ALTER COLUMN "game-run" SET NOT NULL,
ALTER COLUMN "word" SET NOT NULL;

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "word" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_word_fkey" FOREIGN KEY ("word") REFERENCES "game-words"("word") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game-run-guesses" ADD CONSTRAINT "game-run-guesses_game-run_fkey" FOREIGN KEY ("game-run") REFERENCES "game-runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game-run-guesses" ADD CONSTRAINT "game-run-guesses_word_fkey" FOREIGN KEY ("word") REFERENCES "dictionary"("word") ON DELETE RESTRICT ON UPDATE CASCADE;
