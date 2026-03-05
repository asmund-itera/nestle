"use client";

import { useEffect, useState } from "react";

export default function SessionDatePage() {
    const [currentGuess, setCurrentGuess] = useState("");
    const cells = Array.from({ length: 5 * 7 });
    const guesses = ["horse", "paper"];
    const letters = [...guesses.join("").split(""), ...currentGuess.split("")];

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
                    {cells.map((_, index) => (
                        <div
                            key={index}
                            className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-zinc-300 bg-white text-xl font-semibold text-zinc-900"
                        >
                            {letters[index]?.toUpperCase() ?? ""}
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
