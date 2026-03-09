import { GameRun, SqliteService } from 'src/database/sqlite.service';
import { StatsService } from './stats.service';

const createGameRun = (id: number, date: string, session = 'session-1'): GameRun => ({
    id,
    date,
    session,
});

describe('StatsService', () => {
    let service: StatsService;

    beforeEach(() => {
        const sqliteServiceMock = {
            getAllWinsForSession: jest.fn(),
        } as unknown as SqliteService;

        service = new StatsService(sqliteServiceMock);
    });

    describe('groupWinsIntoStreaks', () => {
        it('should return empty array when no wins are provided', () => {
            const streaks = service['groupWinsIntoStreaks']([]);

            expect(streaks).toEqual([]);
        });

        it('should group consecutive days into nested streak arrays', () => {
            const wins: GameRun[] = [
                createGameRun(1, '2026-03-09'),
                createGameRun(2, '2026-03-08'),
                createGameRun(3, '2026-03-06'),
                createGameRun(4, '2026-03-05'),
                createGameRun(5, '2026-03-03'),
            ];

            const streaks = service['groupWinsIntoStreaks'](wins);

            expect(streaks).toEqual([
                [wins[0], wins[1]],
                [wins[2], wins[3]],
                [wins[4]],
            ]);
        });
    });

    describe('findCurrentStreak', () => {
        it('should return the streak length when a streak contains today', () => {
            const streaks: GameRun[][] = [
                [createGameRun(1, '2026-03-09'), createGameRun(2, '2026-03-08')],
                [createGameRun(3, '2026-03-05')],
            ];

            const currentStreak = service['findCurrentStreak'](streaks, '2026-03-09');

            expect(currentStreak).toBe(2);
        });

        it('should return 0 when no streak contains today', () => {
            const streaks: GameRun[][] = [
                [createGameRun(1, '2026-03-08'), createGameRun(2, '2026-03-07')],
                [createGameRun(3, '2026-03-05')],
            ];

            const currentStreak = service['findCurrentStreak'](streaks, '2026-03-09');

            expect(currentStreak).toBe(0);
        });
    });
});