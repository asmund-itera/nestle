import { Injectable } from '@nestjs/common';
import { SqliteService } from '../database/sqlite.service';

export type GameRun = {
    id: number;
    date: string;
    session: string;
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
    constructor(private readonly sqliteService: SqliteService) { }

    getGameRun(id: number): GameRun {
        const dbGameRun = this.sqliteService.getGameRunById(id);

        if (!dbGameRun) {
            throw new Error('Game run not found');
        }

        return {
            ...dbGameRun,
            guesses: this.getGameRunGuesses(dbGameRun.id, dbGameRun.date),
        };
    }

    getOrCreateGameRun(session: string, date: string): GameRun {
        const dbGameRun =
            this.sqliteService.getGameRunByDate(date, session) ||
            this.sqliteService.createGameRun(date, session);

        return {
            ...dbGameRun,
            guesses: this.getGameRunGuesses(dbGameRun.id, date),
        };
    }

    getGameRunGuesses(gameRunId: number, date: string): Guess[] {
        const dbGuesses = this.sqliteService.getGameRunGuesses(gameRunId);
        const solution = (this.sqliteService.getWordOfTheDay(date)
            || this.sqliteService.createWordOfTheDay(date)).word;

        return dbGuesses.map((guess) => ({
            letters: guess.word.split("").map((letter, index) => ({
                value: letter,
                isCorrect: solution[index] === letter,
                isPresent: solution.includes(letter) && solution[index] !== letter,
            })),
        }));
    }

    createGameRunGuess(gameRunId: number, word: string, date: string): GameRun {
        const gameRun = this.sqliteService.getGameRunById(gameRunId);

        if (!gameRun) {
            throw new Error('Game run not found');
        }

        this.sqliteService.createGameRunGuess(gameRunId, word);

        return {
            ...gameRun,
            guesses: this.getGameRunGuesses(gameRunId, date),
        };
    }
}