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