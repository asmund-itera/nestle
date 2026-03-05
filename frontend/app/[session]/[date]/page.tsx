"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function SessionDatePage() {
    const { session, date } = useParams<{ session: string; date: string }>();

    const [gameRun, setGameRun] = useState<GameRunResponse | null>(null);
    const [currentGuess, setCurrentGuess] = useState("");
    const [isCurrentGuessIllegal, setIsCurrentGuessIllegal] = useState<boolean>(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
    const cells = Array.from({ length: 5 * 7 });
    const guesses = gameRun?.guesses ?? [];
    const committedLetters = guesses.flatMap((guess) =>
        guess.letters.map((letter) => letter.value),
    );
    const letters = [...committedLetters, ...currentGuess.split("")];
    const committedLettersCount = committedLetters.length;

    useEffect(() => {
        if (!session || !date) {
            return;
        }

        let isCancelled = false;

        const loadGameRun = async () => {
            const response = await fetch(`/api/game/${encodeURIComponent(session)}/${encodeURIComponent(date)}`);

            if (!response.ok || isCancelled) {
                return;
            }

            const gameRun = (await response.json()) as GameRunResponse;
            setGameRun(gameRun);
        };

        void loadGameRun();

        return () => {
            isCancelled = true;
        };
    }, [session, date]);

    useEffect(() => {
        if (currentGuess.length !== 5) {
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
    }, [currentGuess, gameRun]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace") {
                setCurrentGuess((prev) => prev.slice(0, -1));
                return;
            }

            if (/^[a-z]$/i.test(event.key)) {
                setCurrentGuess((prev) => {
                    if (prev.length >= 5) {
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
    }, []);

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-10">
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
                <h1 className="text-4xl font-bold tracking-wide text-zinc-900">Nestle</h1>

                <section
                    aria-label="Game grid"
                    className="grid grid-cols-5 gap-2"
                >
                    {cells.map((_, index) => {
                        // Highlight the active 5-letter guess row if the word is illegal.
                        const isCurrentGuessCell =
                            index >= committedLettersCount &&
                            index < committedLettersCount + 5;
                        const isIllegalCurrentGuessCell =
                            isCurrentGuessCell && isCurrentGuessIllegal;

                        return (
                            <div
                                key={index}
                                className={`flex h-12 w-12 items-center justify-center rounded-sm border-2 text-xl font-semibold text-zinc-900 ${isIllegalCurrentGuessCell
                                    ? "border-red-500 bg-red-200"
                                    : "border-zinc-300 bg-white"
                                    }`}
                            >
                                {letters[index]?.toUpperCase() ?? ""}
                            </div>
                        );
                    })}
                </section>
            </div>
        </main>
    );
}
