"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PuzzleGrid } from "./_components/puzzle-grid";
import type { CellStatus } from "./_components/puzzle-cell";
import type { CommittedGridCell } from "./_components/puzzle-grid";

type GameRunLetter = {
    value: string;
    isCorrect: boolean;
    isPresent: boolean;
};

type GameRunGuess = {
    letters: GameRunLetter[];
};

type GameRunResponse = {
    id: number;
    date: string;
    session: string;
    guesses: GameRunGuess[];
};

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

    const [gameRun, setGameRun] = useState<GameRunResponse | null>(null);
    const [currentGuess, setCurrentGuess] = useState("");
    const [isCurrentGuessIllegal, setIsCurrentGuessIllegal] = useState<boolean>(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
    const guesses = gameRun?.guesses ?? [];
    const committedLetterStates = guesses.flatMap((guess) => guess.letters);
    const committedLetters = guesses.flatMap((guess) =>
        guess.letters.map((letter) => letter.value),
    );
    const committedGrid: CommittedGridCell[][] = [
        ...guesses.map((guess) =>
            guess.letters.map(({value, isCorrect, isPresent}) => ({
                    letter: value,
                    status: (isCorrect) ? "correct" : (isPresent) ? "present" : "absent",
            })),
        ),
        ...Array.from({ length: Math.max(0, maxGuesses - guesses.length) }, () =>
            Array.from({ length: wordLength }, () => ({
                letter: "",
                status: "empty" as const,
            })),
        ),
    ];
    const isOutOfGuesses = guesses.length >= maxGuesses;
    const latestGuess = guesses.at(-1);
    const isSolved =
        !!latestGuess &&
        latestGuess.letters.length === wordLength &&
        latestGuess.letters.every((letter) => letter.isCorrect);

    useEffect(() => {
        let isCancelled = false;

        const loadGameRun = async () => {
            const response = await fetch(`/api/game/${encodeURIComponent(date)}`);

            if (!response.ok || isCancelled) {
                return;
            }

            const loadedGameRun = (await response.json()) as GameRunResponse;
            setGameRun(loadedGameRun);
        };

        void loadGameRun();

        return () => {
            isCancelled = true;
        };
    }, [date]);

    useEffect(() => {
        if (isSolved) {
            return;
        }

        if (currentGuess.length !== wordLength) {
            setIsCurrentGuessIllegal(false);
            return;
        }

        if (!gameRun || isSubmittingGuess) {
            return;
        }

        let isCancelled = false;

        const checkWord = async () => {
            const response = await fetch(`/api/dictionary/check/${encodeURIComponent(currentGuess)}`);

            if (isCancelled) {
                return;
            }

            if (response.status === 200) {
                setIsCurrentGuessIllegal(false);
                setIsSubmittingGuess(true);

                const submitResponse = await fetch(`/api/game/${gameRun.id}/guess`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ word: currentGuess }),
                });

                if (isCancelled) {
                    return;
                }

                if (submitResponse.ok) {
                    const updatedGameRun = (await submitResponse.json()) as GameRunResponse;
                    setGameRun(updatedGameRun);
                    setCurrentGuess("");
                }

                setIsSubmittingGuess(false);
                return;
            }

            setIsCurrentGuessIllegal(true);
        };

        void checkWord();

        return () => {
            isCancelled = true;
        };
    }, [currentGuess, gameRun, isSolved]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSolved || isOutOfGuesses) {
                return;
            }

            if (event.key === "Backspace") {
                setCurrentGuess((prev) => prev.slice(0, -1));
                return;
            }

            if (/^[a-z]$/i.test(event.key)) {
                setCurrentGuess((prev) => {
                    if (prev.length >= wordLength) {
                        return prev;
                    }

                    return `${prev}${event.key.toLowerCase()}`;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOutOfGuesses, isSolved]);

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
                    <div className="flex max-w-md flex-col gap-2">
                        {[[..."qwertyuiop"], [..."asdfghjkl"], [..."zxcvbnm"]].map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="flex flex-row justify-center gap-2"
                            >
                                {row.map((letter) => {
                                    const isCommitted = committedLetters.includes(letter);
                                    let cellColorClass = "border-zinc-300 bg-white text-zinc-700";

                                    if (isCommitted) {
                                        const letterState = committedLetterStates.find(
                                            (l) => l.value === letter,
                                        );

                                        if (letterState?.isCorrect) {
                                            cellColorClass = "border-green-700 bg-green-500 text-white";
                                        } else if (letterState?.isPresent) {
                                            cellColorClass = "border-yellow-700 bg-yellow-400";
                                        } else {
                                            cellColorClass = "border-zinc-500 bg-zinc-400 text-white";
                                        }
                                    }

                                    return (
                                        <div
                                            key={letter}
                                            className={`rounded-sm border p-2 text-xs font-medium ${cellColorClass}`}
                                        >
                                            {letter.toUpperCase()}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}
