import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import type { Dictionary, Game, GameRun, GameRunGuess, GameWord } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL is not set');
        }

        super({
            adapter: new PrismaPg({ connectionString }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    getWord(word: string): Promise<Dictionary | null> {
        return this.dictionary.findUnique({
            where: { word },
        });
    }

    async getRandomWord(): Promise<GameWord | null> {
        const rows = await this.$queryRaw<Array<{ word: string }>>`
            SELECT word
            FROM "game-words"
            ORDER BY RANDOM()
            LIMIT 1
        `;

        return rows[0] ?? null;
    }

    getGameRunById(id: number): Promise<GameRun | null> {
        return this.gameRun.findUnique({
            where: { id },
        });
    }

    getGameRunByDate(date: Date, session: string): Promise<GameRun | null> {
        return this.gameRun.findFirst({
            where: {
                date,
                session,
            },
        });
    }

    createGameRun(date: Date, session: string): Promise<GameRun> {
        return this.gameRun.create({
            data: {
                date,
                session,
            },
        });
    }

    getGameRunGuesses(gameRunId: number): Promise<GameRunGuess[]> {
        return this.gameRunGuess.findMany({
            where: { gameRunId },
        });
    }

    createGameRunGuess(gameRunId: number, word: string): Promise<GameRunGuess> {
        return this.gameRunGuess.create({
            data: {
                gameRunId,
                word,
            },
        });
    }

    getWordOfTheDay(date: Date) {
        return this.game.findUnique({
            where: { date },
        });
    }

    async createWordOfTheDay(date: Date): Promise<Game | null> {
        const randomWord = await this.getRandomWord();

        if (randomWord) {
            return this.game.create({
                data: {
                    ...randomWord,
                    date
                },
            });
        } else {
            return null;
        }
    }

    getAllWinsForSession(sessionId: string): Promise<GameRun[]> {
        return this.gameRun.findMany({
            where: {
                session: sessionId,
            },
            include: {
                guesses: true,
            },
            orderBy: {
                date: 'desc',
            },
        }).then(async (gameRunsWithGuesses) => {
            if (gameRunsWithGuesses.length === 0) {
                return [];
            }

            const games = await this.game.findMany({
                where: {
                    date: {
                        in: gameRunsWithGuesses.map((gameRun) => gameRun.date),
                    },
                },
            });

            const gameWordByDate = new Map(
                games.map((game) => [game.date.toISOString().slice(0, 10), game.word]),
            );

            return gameRunsWithGuesses
                .filter((gameRun) => {
                    const gameWord = gameWordByDate.get(gameRun.date.toISOString().slice(0, 10));

                    if (!gameWord) {
                        return false;
                    }

                    return gameRun.guesses.some((guess) => guess.word === gameWord);
                })
                .map(({ id, date, session }) => ({ id, date, session }));
        });
    }
}