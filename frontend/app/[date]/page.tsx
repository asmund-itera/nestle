"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PuzzleGrid } from "./_components/puzzle-grid";
import { Keyboard } from "./_components/keyboard";
import type { CellStatus } from "./_components/puzzle-cell";
import type { CommittedGridCell } from "./_components/puzzle-grid";
import { useGameRun } from "./_hooks/use-game-run";

function shiftIsoDate(dateValue: string, days: number): string | null {
    const parsedDate = new Date(`${dateValue}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    parsedDate.setUTCDate(parsedDate.getUTCDate() + days);
    return parsedDate.toISOString().slice(0, 10);
}

export default function SessionDatePage() {
    const { date } = useParams<{ date: string }>();
    const previousDate = shiftIsoDate(date, -1);
    const nextDate = shiftIsoDate(date, 1);

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
    const committedGrid: CommittedGridCell[][] = [
        ...guesses.map((guess) =>
            guess.letters.map(({ value, isCorrect, isPresent }) => {
                let status: CellStatus = "absent";

                if (isCorrect) {
                    status = "correct";
                } else if (isPresent) {
                    status = "present";
                }

                return {
                    letter: value,
                    status,
                };
            }),
        ),
        ...Array.from({ length: Math.max(0, maxGuesses - guesses.length) }, () =>
            Array.from({ length: wordLength }, () => ({
                letter: "",
                status: "empty" as const,
            })),
        ),
    ];
    return (
        <main className={`min-h-screen px-6 py-10 ${isSolved ? "bg-green-100" : "bg-zinc-50"}`}>
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
                <nav
                    aria-label="Date navigation"
                    className="flex w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
                >
                    {previousDate ? (
                        <Link
                            href={`/${encodeURIComponent(previousDate)}`}
                            className="transition-colors hover:text-zinc-900"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="text-zinc-400">Previous</span>
                    )}

                    <span className="text-zinc-900">{date}</span>

                    {nextDate ? (
                        <Link
                            href={`/${encodeURIComponent(nextDate)}`}
                            className="transition-colors hover:text-zinc-900"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="text-zinc-400">Next</span>
                    )}
                </nav>

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
                    <Keyboard gameRunLetters={gameRunLetters} />
                )}

            </div>
        </main>
    );
}
