-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_word_fkey";

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_word_fkey" FOREIGN KEY ("word") REFERENCES "game-words"("word") ON DELETE SET NULL ON UPDATE CASCADE;
