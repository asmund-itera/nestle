import type { KeyboardKeyState } from "../_lib/game-view-model";

type KeyboardProps = {
  keyStates: Record<string, KeyboardKeyState>;
};

const keyboardRows = [[..."qwertyuiop"], [..."asdfghjkl"], [..."zxcvbnm"]];

const keyStateClassMap: Record<KeyboardKeyState, string> = {
  unused: "border-zinc-300 bg-white text-zinc-700",
  correct: "border-green-700 bg-green-500 text-white",
  present: "border-yellow-700 bg-yellow-400",
  absent: "border-zinc-500 bg-zinc-400 text-white",
};

export function Keyboard({ keyStates }: KeyboardProps) {
  return (
    <div className="flex max-w-md flex-col gap-2">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row justify-center gap-2">
          {row.map((letter) => {
            const cellColorClass = keyStateClassMap[keyStates[letter] ?? "unused"];

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
