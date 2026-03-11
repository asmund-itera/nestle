import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useState } from "react";
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
    handleLetterInput: (letter: string) => void;
    handleBackspaceInput: () => void;
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

    const { mutateAsync: submitGuess, isPending: isSubmittingGuess } = submitGuessMutation;

    const guesses = gameRun?.guesses ?? [];
    const gameRunLetters = guesses.flatMap((guess) => guess.letters);
    const isOutOfGuesses = guesses.length >= maxGuesses;
    const latestGuess = guesses.at(-1);
    const isSolved =
        !!latestGuess &&
        latestGuess.letters.length === wordLength &&
        latestGuess.letters.every((letter) => letter.isCorrect);

    const attemptGuess = useEffectEvent(async (guess: string) => {
        if (!gameRun) {
            return;
        }

        try {
            await submitGuess(guess);
            setIsCurrentGuessIllegal(false);
        } catch (error) {
            if (error instanceof IllegalWordError) {
                setIsCurrentGuessIllegal(true);
                return;
            }

            setIsCurrentGuessIllegal(false);
        }
    });

    const handleLetterInput = useEffectEvent((letter: string) => {
        if (isSolved || isOutOfGuesses || isSubmittingGuess) {
            return;
        }

        if (!/^[a-z]$/i.test(letter)) {
            return;
        }

        if (currentGuess.length >= wordLength) {
            return;
        }

        const nextGuess = `${currentGuess}${letter.toLowerCase()}`;
        setCurrentGuess(nextGuess);

        if (nextGuess.length === wordLength) {
            void attemptGuess(nextGuess);
            return;
        }

        setIsCurrentGuessIllegal(false);
    });

    const handleBackspaceInput = useEffectEvent(() => {
        if (isSolved || isOutOfGuesses) {
            return;
        }

        setCurrentGuess((prev) => prev.slice(0, -1));
        setIsCurrentGuessIllegal(false);
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace") {
                handleBackspaceInput();
                return;
            }

            if (/^[a-z]$/i.test(event.key)) {
                handleLetterInput(event.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return {
        gameRun,
        guesses,
        gameRunLetters,
        currentGuess,
        isCurrentGuessIllegal,
        isSubmittingGuess,
        isOutOfGuesses,
        isSolved,
        handleLetterInput,
        handleBackspaceInput,
    };
}
