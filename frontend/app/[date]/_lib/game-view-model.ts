import type { CommittedGridCell } from "../_components/puzzle-grid";
import type { CellStatus } from "../_components/puzzle-cell";
import type { GameRunGuess, GameRunLetter } from "../_types/game";

export type KeyboardKeyState = "unused" | "correct" | "present" | "absent";

export function buildCommittedGrid(
  guesses: GameRunGuess[],
  wordLength: number,
  maxGuesses: number,
): CommittedGridCell[][] {
  return [
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
}

export function buildKeyboardKeyStates(
  gameRunLetters: GameRunLetter[],
  keys: string[],
): Record<string, KeyboardKeyState> {
  const keyStates: Record<string, KeyboardKeyState> = {};

  for (const key of keys) {
    const letterState = gameRunLetters.find((entry) => entry.value === key);

    if (!letterState) {
      keyStates[key] = "unused";
      continue;
    }

    if (letterState.isCorrect) {
      keyStates[key] = "correct";
      continue;
    }

    if (letterState.isPresent) {
      keyStates[key] = "present";
      continue;
    }

    keyStates[key] = "absent";
  }

  return keyStates;
}
