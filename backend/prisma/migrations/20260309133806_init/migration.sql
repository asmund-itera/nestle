-- CreateTable
CREATE TABLE "dictionary" (
    "word" TEXT NOT NULL,

    CONSTRAINT "dictionary_pkey" PRIMARY KEY ("word")
);

-- CreateTable
CREATE TABLE "game-words" (
    "word" TEXT NOT NULL,

    CONSTRAINT "game-words_pkey" PRIMARY KEY ("word")
);

-- CreateTable
CREATE TABLE "games" (
    "date" DATE NOT NULL,
    "word" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "game-runs" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "session" TEXT NOT NULL,

    CONSTRAINT "game-runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game-run-guesses" (
    "id" SERIAL NOT NULL,
    "game-run" INTEGER,
    "word" TEXT,

    CONSTRAINT "game-run-guesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game-runs_date_idx" ON "game-runs"("date");

-- CreateIndex
CREATE INDEX "game-runs_session_idx" ON "game-runs"("session");

-- CreateIndex
CREATE INDEX "game-run-guesses_game-run_idx" ON "game-run-guesses"("game-run");

-- CreateIndex
CREATE INDEX "game-run-guesses_word_idx" ON "game-run-guesses"("word");

-- AddForeignKey
ALTER TABLE "game-words" ADD CONSTRAINT "game-words_word_fkey" FOREIGN KEY ("word") REFERENCES "dictionary"("word") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_word_fkey" FOREIGN KEY ("word") REFERENCES "dictionary"("word") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game-run-guesses" ADD CONSTRAINT "game-run-guesses_game-run_fkey" FOREIGN KEY ("game-run") REFERENCES "game-runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game-run-guesses" ADD CONSTRAINT "game-run-guesses_word_fkey" FOREIGN KEY ("word") REFERENCES "dictionary"("word") ON DELETE SET NULL ON UPDATE CASCADE;
