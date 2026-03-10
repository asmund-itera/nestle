import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import type { GameRun as DbGameRun } from '../../generated/prisma/client';

export type GameRun = DbGameRun & {
    guesses: Guess[];
};

export type Guess = {
    letters: Letter[];
}

export type Letter = {
    value: string;
    isCorrect: boolean;
    isPresent: boolean;
};

@Injectable()
export class GameRunService {
    constructor(private readonly prismaService: PrismaService) { }

    async getGameRun(id: number): Promise<GameRun> {
        const dbGameRun = await this.prismaService.getGameRunById(id);

        if (!dbGameRun) {
            throw new Error('Game run not found');
        }

        return {
            ...dbGameRun,
            guesses: await this.getGameRunGuesses(dbGameRun.id, dbGameRun.date),
        };
    }

    async getOrCreateGameRun(session: string, date: Date): Promise<GameRun> {
        const dbGameRun =
            await this.prismaService.getGameRunByDate(date, session) ||
            await this.prismaService.createGameRun(date, session);

        return {
            ...dbGameRun,
            guesses: await this.getGameRunGuesses(dbGameRun.id, dbGameRun.date),
        };
    }

    async getGameRunGuesses(gameRunId: number, date: Date): Promise<Guess[]> {
        const dbGuesses = await this.prismaService.getGameRunGuesses(gameRunId);
        const wordOfDay = await this.prismaService.getWordOfTheDay(date)
            || await this.prismaService.createWordOfTheDay(date);
        const solution = wordOfDay?.word || "";

        return dbGuesses.map((guess) => {
            let letters = guess.word.split("").map((letter, index) => ({
                value: letter,
                isCorrect: false,
                isPresent: false,
            }));
            let solutionLetters = solution.split("");

            for (let i = 0; i < letters.length; i++) {
                if (letters[i].value === solutionLetters[i]) {
                    letters[i].isCorrect = true;
                    solutionLetters[i] = "";
                }
            }
            for (let i = 0; i < letters.length; i++) {
                if (!letters[i].isCorrect && solutionLetters.includes(letters[i].value)) {
                    letters[i].isPresent = true;
                    solutionLetters[solutionLetters.indexOf(letters[i].value)] = "";
                }
            }
            return {
                letters: letters,
            };
        });
    }

    async createGameRunGuess(gameRunId: number, word: string, date: Date): Promise<GameRun> {
        const gameRun = await this.prismaService.getGameRunById(gameRunId);

        if (!gameRun) {
            throw new Error('Game run not found');
        }

        await this.prismaService.createGameRunGuess(gameRunId, word);

        return {
            ...gameRun,
            guesses: await this.getGameRunGuesses(gameRunId, date),
        };
    }
}