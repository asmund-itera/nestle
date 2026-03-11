export type CellStatus = "empty" | "correct" | "present" | "absent" | "illegal";

type PuzzleCellProps = {
    letter?: string;
    status: CellStatus;
};

const statusClassMap: Record<CellStatus, string> = {
    empty: "border-zinc-300 bg-white text-zinc-900",
    correct: "border-green-700 bg-green-500 text-white",
    present: "border-yellow-700 bg-yellow-400 text-zinc-900",
    absent: "border-zinc-500 bg-zinc-400 text-white",
    illegal: "border-red-500 bg-red-200 text-zinc-900",
};

export function PuzzleCell({ letter, status }: PuzzleCellProps) {
    return (
        <div
            className={`flex h-12 w-12 items-center justify-center rounded-sm border-2 text-xl font-semibold ${statusClassMap[status]}`}
        >
            {letter?.toUpperCase() ?? ""}
        </div>
    );
}
