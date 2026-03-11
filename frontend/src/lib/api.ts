export type StatsResponse = {
    currentStreak: number;
    longestStreak: number;
    totalGamesPlayed: number;
};

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

export class IllegalWordError extends Error {
    constructor() {
        super("Word is not in dictionary");
        this.name = "IllegalWordError";
    }
}

export async function fetchStats(): Promise<StatsResponse> {
    const response = await fetch("/api/stats");

    if (!response.ok) {
        throw new Error("Failed to load stats");
    }

    return (await response.json()) as StatsResponse;
}

export async function fetchGameRun(date: string): Promise<GameRunResponse> {
    const response = await fetch(`/api/game/${encodeURIComponent(date)}`);

    if (!response.ok) {
        throw new Error("Failed to load game run");
    }

    return (await response.json()) as GameRunResponse;
}

export async function checkDictionaryWord(word: string): Promise<boolean> {
    const response = await fetch(`/api/dictionary/check/${encodeURIComponent(word)}`);

    if (response.status === 200) {
        return true;
    }

    if (response.status === 404) {
        return false;
    }

    throw new Error("Failed to validate dictionary word");
}

export async function submitGameRunGuess(
    gameRunId: number,
    word: string,
): Promise<GameRunResponse> {
    const response = await fetch(`/api/game/${gameRunId}/guess`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
    });

    if (!response.ok) {
        throw new Error("Failed to submit guess");
    }

    return (await response.json()) as GameRunResponse;
}
