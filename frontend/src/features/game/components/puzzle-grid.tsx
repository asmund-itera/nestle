import { PuzzleCell, type CellStatus } from "./puzzle-cell";

export type CommittedGridCell = {
    letter: string;
    status: CellStatus;
};

type PuzzleGridProps = {
    committedGrid: CommittedGridCell[][];
    currentGuess: string;
    isCurrentGuessIllegal: boolean;
};

export function PuzzleGrid({
    committedGrid,
    currentGuess,
    isCurrentGuessIllegal,
}: PuzzleGridProps) {
    const wordLength = committedGrid[0]?.length ?? 0;
    const maxGuesses = committedGrid.length;
    const committedGuessCount = committedGrid.filter((row) =>
        row.some((cell) => cell.letter),
    ).length;
    const currentRowIndex = committedGuessCount < maxGuesses ? committedGuessCount : -1;

    return (
        <section aria-label="Game grid" className="grid grid-cols-5 gap-2">
            {committedGrid.flatMap((rowCells, rowIndex) =>
                rowCells.map((cell, colIndex) => {
                    const currentLetter =
                        rowIndex === currentRowIndex ? (currentGuess[colIndex] ?? "") : "";
                    const isIllegalCurrentRow =
                        rowIndex === currentRowIndex &&
                        isCurrentGuessIllegal &&
                        currentGuess.length === wordLength;

                    return (
                        <PuzzleCell
                            key={`${rowIndex}-${colIndex}`}
                            letter={cell.letter || currentLetter}
                            status={isIllegalCurrentRow ? "illegal" : cell.status}
                        />
                    );
                }),
            )}
        </section>
    );
}
