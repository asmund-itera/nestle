// service that mirrors sqlite service but uses prisma instead of sqlite
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import type { Game, GameRun, GameRunGuess, GameWord } from '../../generated/prisma/client';
import { Dictionary } from 'generated/prisma/browser';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

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
}