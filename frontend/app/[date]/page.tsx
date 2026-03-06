"use client";

import { useParams } from "next/navigation";
import { DateNav } from "./_components/date-nav";
import { PuzzleGrid } from "./_components/puzzle-grid";
import { Keyboard } from "./_components/keyboard";
import { useGameRun } from "./_hooks/use-game-run";
import { buildCommittedGrid, buildKeyboardKeyStates } from "./_lib/game-view-model";

const keyboardRows = [[..."qwertyuiop"], [..."asdfghjkl"], [..."zxcvbnm"]];
const keyboardKeys = keyboardRows.flat();

export default function SessionDatePage() {
    const { date } = useParams<{ date: string }>();

    const wordLength = 5;
    const maxGuesses = 7;

    const {
        guesses,
        gameRunLetters,
        currentGuess,
        isCurrentGuessIllegal,
        isOutOfGuesses,
        isSolved,
    } = useGameRun(date, wordLength, maxGuesses);
    const committedGrid = buildCommittedGrid(guesses, wordLength, maxGuesses);
    const keyboardKeyStates = buildKeyboardKeyStates(gameRunLetters, keyboardKeys);
    return (
        <main className={`min-h-screen px-6 py-10 ${isSolved ? "bg-green-100" : "bg-zinc-50"}`}>
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
                <DateNav date={date} />

                <h1 className="text-4xl font-bold tracking-wide text-zinc-900">Nestle</h1>

                <PuzzleGrid
                    committedGrid={committedGrid}
                    currentGuess={currentGuess}
                    isCurrentGuessIllegal={isCurrentGuessIllegal}
                />

                {isSolved && (
                    <p className="text-center text-lg font-semibold text-green-900">
                        Success! You solved it in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}.
                    </p>
                )}
            
                {!isOutOfGuesses && !isSolved && (
                    <Keyboard keyStates={keyboardKeyStates} />
                )}

            </div>
        </main>
    );
}
