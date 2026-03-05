"use client";

import { useEffect, useState } from "react";

export default function SessionDatePage() {
    const [currentGuess, setCurrentGuess] = useState("");
    const [isCurrentGuessIllegal, setIsCurrentGuessIllegal] = useState<boolean>(false);
    const cells = Array.from({ length: 5 * 7 });
    const guesses = ["horse", "paper"];
    const letters = [...guesses.join("").split(""), ...currentGuess.split("")];
    const committedLettersCount = guesses.join("").length;

    useEffect(() => {
        if (currentGuess.length !== 5) {
            setIsCurrentGuessIllegal(false);
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
                return;
            }

            setIsCurrentGuessIllegal(true);
        };

        void checkWord();

        return () => {
            isCancelled = true;
        };
    }, [currentGuess]);

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
