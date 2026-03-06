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
  const keyStates = Object.fromEntries(
    keys.map((key) => [key, "unused" as KeyboardKeyState]),
  );

  const statePriority: Record<KeyboardKeyState, number> = {
    unused: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };

  for (const letterState of gameRunLetters) {
    if (!(letterState.value in keyStates)) {
      continue;
    }

    const nextState: KeyboardKeyState = letterState.isCorrect
      ? "correct"
      : letterState.isPresent
        ? "present"
        : "absent";

    const currentState = keyStates[letterState.value];

    if (statePriority[nextState] > statePriority[currentState]) {
      keyStates[letterState.value] = nextState;
    }
  }

  return keyStates;
}
