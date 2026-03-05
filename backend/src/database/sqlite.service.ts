import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { get } from 'node:http';

export type DictionaryEntry = {
    word: string;
};

export type GameRun = {
    id: number;
    date: string;
    session: string;
};

export type GameRunGuess = {
    gameRunId: number;
    word: string;
};

@Injectable()
export class SqliteService implements OnModuleInit, OnModuleDestroy {
    private db?: DatabaseSync;

    onModuleInit(): void {
        const dbPath = process.env.SQLITE_PATH ?? join(process.cwd(), 'data.db');
        this.db = new DatabaseSync(dbPath);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS "dictionary" (
                "word"	TEXT UNIQUE,
                PRIMARY KEY("word")
            );
            CREATE TABLE IF NOT EXISTS "game-words" (
                "word"	TEXT UNIQUE,
                PRIMARY KEY("word"),
                CONSTRAINT "dictionary-word" FOREIGN KEY("word") REFERENCES "dictionary"("word")
            );
            CREATE TABLE IF NOT EXISTS "games" (
                "date"	TEXT UNIQUE,
                "word"	TEXT,
                PRIMARY KEY("date"),
                CONSTRAINT "dictionary-word" FOREIGN KEY("word") REFERENCES "dictionary"("word")
            );
            CREATE TABLE IF NOT EXISTS "game-runs" (
                "id"	INTEGER NOT NULL UNIQUE,
                "date"	TEXT NOT NULL,
                "session"	TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
            CREATE TABLE IF NOT EXISTS "game-run-guesses" (
                "id"	INTEGER NOT NULL UNIQUE,
                "game-run"	INTEGER,
                "word"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT),
                CONSTRAINT "game-run-id" FOREIGN KEY("game-run") REFERENCES "game-runs"("id"),
                CONSTRAINT "dictionary-word" FOREIGN KEY("word") REFERENCES "dictionary"("word")
            );
        `);
    }

    onModuleDestroy(): void {
        this.db?.close();
    }

    getWord(word: string): DictionaryEntry | null {
        const db = this.getDb();

        return (
            (db
                .prepare('SELECT * FROM dictionary WHERE word = ?')
                .get(word) as DictionaryEntry) || null
        );
    }

    getRandomWord(): DictionaryEntry | null {
        const db = this.getDb();

        return (
            (db
                .prepare(
                    'SELECT * FROM dictionary ORDER BY RANDOM() LIMIT 1',
                )
                .get() as DictionaryEntry) || null
        );
    }

    getGameRun(id: number): GameRun | null {
        const db = this.getDb();

        return (
            (db
                .prepare(
                    'SELECT * FROM "game-runs" WHERE id = ?',
                )
                .get(id) as GameRun) || null
        );
    }

    getGameRunByDate(date: string, sessionId: string): GameRun | null {
        const db = this.getDb();

        return (
            (db
                .prepare(
                    'SELECT * FROM "game-runs" WHERE date = ? AND session = ?',
                )
                .get(date, sessionId) as GameRun) || null
        );
    }

    createGameRun(date: string, sessionId: string): GameRun {
        const db = this.getDb();

        const existingRun = this.getGameRunByDate(date, sessionId);
        if (existingRun) {
            return existingRun;
        }
        const gameRunResult = db
            .prepare(
                'INSERT INTO "game-runs" (date, session) VALUES (?, ?)',
            )
            .run(date, sessionId);

        const gameRunId = gameRunResult.lastInsertRowid as number;

        return {
            id: gameRunId,
            date,
            session: sessionId,
        };
    }

    getGameRunGuesses(gameRunId: number): GameRunGuess[] {
        const db = this.getDb();

        return db
            .prepare(
                'SELECT * FROM "game-run-guesses" WHERE "game-run" = ?',
            )
            .all(gameRunId) as GameRunGuess[];
    }

    createGameRunGuess(gameRunId: number, word: string): GameRunGuess {
        const db = this.getDb();

        const guessResult = db
            .prepare(
                'INSERT INTO "game-run-guesses" ("game-run", word) VALUES (?, ?)',
            )
            .run(gameRunId, word);

        return {
            gameRunId,
            word,
        };
    }

    private getDb(): DatabaseSync {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        return this.db;
    }
}