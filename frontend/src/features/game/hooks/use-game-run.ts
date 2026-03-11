import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
    checkDictionaryWord,
    fetchGameRun,
    IllegalWordError,
    submitGameRunGuess,
} from "../../../lib/api";
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
    const queryClient = useQueryClient();
    const [currentGuess, setCurrentGuess] = useState("");
    const [isCurrentGuessIllegal, setIsCurrentGuessIllegal] =
        useState<boolean>(false);

    const { data: gameRunData } = useQuery({
        queryKey: ["gameRun", date],
        queryFn: () => fetchGameRun(date),
    });

    const gameRun = gameRunData ?? null;

    const submitGuessMutation = useMutation({
        mutationFn: async (word: string) => {
            if (!gameRun) {
                throw new Error("Game run not loaded");
            }

            const isDictionaryWord = await checkDictionaryWord(word);

            if (!isDictionaryWord) {
                throw new IllegalWordError();
            }

            return submitGameRunGuess(gameRun.id, word);
        },
        onSuccess: (updatedGameRun) => {
            queryClient.setQueryData(["gameRun", date], updatedGameRun);
            setCurrentGuess("");
            setIsCurrentGuessIllegal(false);
        },
    });

    const isSubmittingGuess = submitGuessMutation.isPending;

    const guesses = gameRun?.guesses ?? [];
    const gameRunLetters = guesses.flatMap((guess) => guess.letters);
    const isOutOfGuesses = guesses.length >= maxGuesses;
    const latestGuess = guesses.at(-1);
    const isSolved =
        !!latestGuess &&
        latestGuess.letters.length === wordLength &&
        latestGuess.letters.every((letter) => letter.isCorrect);

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

        const checkWordAndSubmit = async () => {
            try {
                await submitGuessMutation.mutateAsync(currentGuess);

                if (isCancelled) {
                    return;
                }

                setIsCurrentGuessIllegal(false);
            } catch (error) {
                if (isCancelled) {
                    return;
                }

                if (error instanceof IllegalWordError) {
                    setIsCurrentGuessIllegal(true);
                    return;
                }

                setIsCurrentGuessIllegal(false);
            }
        };

        void checkWordAndSubmit();

        return () => {
            isCancelled = true;
        };
    }, [
        currentGuess,
        gameRun,
        isSolved,
        wordLength,
        isSubmittingGuess,
        submitGuessMutation,
    ]);

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
