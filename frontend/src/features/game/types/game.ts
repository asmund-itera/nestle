export type GameRunLetter = {
    value: string;
    isCorrect: boolean;
    isPresent: boolean;
};

export type GameRunGuess = {
    letters: GameRunLetter[];
};

export type GameRunResponse = {
    id: number;
    date: string;
    session: string;
    guesses: GameRunGuess[];
};
