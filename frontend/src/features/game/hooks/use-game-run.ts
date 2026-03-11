import { useEffect, useState } from "react";
import type {
    GameRunGuess,
    GameRunLetter,
    GameRunResponse,
} from "../types/game";

type UseGameRunResult = {
    gameRun: GameRunResponse | null;
    guesses: GameRunGuess[];
    gameRunLetters: GameRunLetter[];
    currentGuess: string;
    isCurrentGuessIllegal: boolean;
    isSubmittingGuess: boolean;
    isOutOfGuesses: boolean;
    isSolved: boolean;
};

export function useGameRun(
    date: string,
    wordLength: number,
    maxGuesses: number,
): UseGameRunResult {
    const [gameRun, setGameRun] = useState<GameRunResponse | null>(null);
    const [currentGuess, setCurrentGuess] = useState("");
    const [isCurrentGuessIllegal, setIsCurrentGuessIllegal] =
        useState<boolean>(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);

    const guesses = gameRun?.guesses ?? [];
    const gameRunLetters = guesses.flatMap((guess) => guess.letters);
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
            const response = await fetch(
                `/api/dictionary/check/${encodeURIComponent(currentGuess)}`,
            );

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
    }, [currentGuess, gameRun, isSolved, wordLength, isSubmittingGuess]);

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
    }, [isOutOfGuesses, isSolved, wordLength]);

    return {
        gameRun,
        guesses,
        gameRunLetters,
        currentGuess,
        isCurrentGuessIllegal,
        isSubmittingGuess,
        isOutOfGuesses,
        isSolved,
    };
}
