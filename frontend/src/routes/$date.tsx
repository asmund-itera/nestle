import { Link, createFileRoute } from "@tanstack/react-router";
import { DateNav } from "../features/game/components/date-nav";
import { Keyboard } from "../features/game/components/keyboard";
import { PuzzleGrid } from "../features/game/components/puzzle-grid";
import { KEYBOARD_KEYS, MAX_GUESSES, WORD_LENGTH } from "../features/game/config/game-config";
import { useGameRun } from "../features/game/hooks/use-game-run";
import {
    buildCommittedGrid,
    buildKeyboardKeyStates,
} from "../features/game/lib/game-view-model";

export const Route = createFileRoute("/$date")({
    component: SessionDatePage,
});

function SessionDatePage() {
    const { date } = Route.useParams();

    const {
        guesses,
        gameRunLetters,
        currentGuess,
        isCurrentGuessIllegal,
        isOutOfGuesses,
        isSolved,
    } = useGameRun(date, WORD_LENGTH, MAX_GUESSES);

    const committedGrid = buildCommittedGrid(guesses, WORD_LENGTH, MAX_GUESSES);
    const keyboardKeyStates = buildKeyboardKeyStates(gameRunLetters, KEYBOARD_KEYS);

    return (
        <main className={`min-h-screen px-6 py-10 ${isSolved ? "bg-green-100" : "bg-zinc-50"}`}>
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
                <DateNav date={date} />

                <Link to="/">
                    <h1 className="text-4xl font-bold tracking-wide text-zinc-900">Nestle</h1>
                </Link>

                <PuzzleGrid
                    committedGrid={committedGrid}
                    currentGuess={currentGuess}
                    isCurrentGuessIllegal={isCurrentGuessIllegal}
                />

                {isSolved && (
                    <p className="text-center text-lg font-semibold text-green-900">
                        Success! You solved it in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}.
                    </p>
                )}

                {!isOutOfGuesses && !isSolved && <Keyboard keyStates={keyboardKeyStates} />}
            </div>
        </main>
    );
}
