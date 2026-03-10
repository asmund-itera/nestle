import { Inject, Injectable } from '@nestjs/common';
import type { GameRun } from '../../generated/prisma/client';
import type { PrismaService } from 'src/database/prisma.service';

export const PRISMA_SERVICE_TOKEN = 'PRISMA_SERVICE_TOKEN';

export type Stats = {
    currentStreak: number;
    longestStreak: number;
    totalGamesPlayed: number;
};

@Injectable()
export class StatsService {
    constructor(
        @Inject(PRISMA_SERVICE_TOKEN)
        private readonly prismaService: Pick<PrismaService, 'getAllWinsForSession'>,
    ) { }

    async getStats(session: string): Promise<Stats> {
        const allWins = await this.prismaService.getAllWinsForSession(session);
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
            previousWinDate.setHours(0, 0, 0, 0);
            const currentWinDate = new Date(wins[i].date);
            currentWinDate.setHours(0, 0, 0, 0);
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

    private findCurrentStreak(streaks: GameRun[][], today: Date = new Date()): number {
        const todayString = today.toISOString().split('T')[0];
        for (const streak of streaks) {
            if (streak.some((win) => win.date.toISOString().split('T')[0] === todayString)) {
                return streak.length;
            }
        }

        return 0;
    }
}