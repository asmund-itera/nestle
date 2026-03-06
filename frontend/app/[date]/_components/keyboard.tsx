import type { GameRunLetter } from "../_hooks/use-game-run";

type KeyboardProps = {
  gameRunLetters: GameRunLetter[];
};

const keyboardRows = [[..."qwertyuiop"], [..."asdfghjkl"], [..."zxcvbnm"]];

export function Keyboard({ gameRunLetters }: KeyboardProps) {
  const committedLetters = gameRunLetters.map((letter) => letter.value);

  return (
    <div className="flex max-w-md flex-col gap-2">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row justify-center gap-2">
          {row.map((letter) => {
            const isCommitted = committedLetters.includes(letter);
            let cellColorClass = "border-zinc-300 bg-white text-zinc-700";

            if (isCommitted) {
              const letterState = gameRunLetters.find((entry) => entry.value === letter);

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
  );
}
