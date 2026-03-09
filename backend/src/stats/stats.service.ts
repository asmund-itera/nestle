import { Injectable } from '@nestjs/common';
import { GameRun, SqliteService } from 'src/database/sqlite.service';

export type Stats = {
    currentStreak: number;
    longestStreak: number;
    totalGamesPlayed: number;
};

@Injectable()
export class StatsService {
    constructor(private readonly sqliteService: SqliteService) { }

    getStats(session: string): Stats {
        const allWins = this.sqliteService.getAllWinsForSession(session);
        const streaks = this.groupWinsIntoStreaks(allWins);
        const currentStreak = this.findCurrentStreak(streaks);

        return {
            currentStreak: currentStreak || 0,
            longestStreak: streaks.length > 0 ? Math.max(...streaks.map((streak) => streak.length)) : 0,
            totalGamesPlayed: allWins.length,
        };
    }

    private groupWinsIntoStreaks(wins: GameRun[]): GameRun[][] {
        if (wins.length === 0) {
            return [];
        }

        const streaks: GameRun[][] = [];
        let currentStreak: GameRun[] = [wins[0]];

        for (let i = 1; i < wins.length; i++) {
            const previousWinDate = new Date(wins[i - 1].date);
            const currentWinDate = new Date(wins[i].date);
            const differenceInDays = (previousWinDate.getTime() - currentWinDate.getTime()) / (1000 * 3600 * 24);

            if (differenceInDays === 1) {
                currentStreak.push(wins[i]);
            } else {
                streaks.push(currentStreak);
                currentStreak = [wins[i]];
            }
        }

        streaks.push(currentStreak);
        return streaks;
    }

    private findCurrentStreak(streaks: GameRun[][], today: string = new Date().toISOString().split('T')[0]): number {
        for (const streak of streaks) {
            if (streak.some((win) => win.date === today)) {
                return streak.length;
            }
        }

        return 0;
    }
}