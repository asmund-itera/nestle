export type StatsResponse = {
    currentStreak: number;
    longestStreak: number;
    totalGamesPlayed: number;
};

export async function fetchStats(): Promise<StatsResponse> {
    const response = await fetch("/api/stats");

    if (!response.ok) {
        throw new Error("Failed to load stats");
    }

    return (await response.json()) as StatsResponse;
}
