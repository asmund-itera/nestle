import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

export type DictionaryEntry = {
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
                PRIMARY KEY("word")
            );
            CREATE TABLE IF NOT EXISTS "games" (
                "date"	TEXT UNIQUE,
                "word"	TEXT,
                PRIMARY KEY("date")
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
                CONSTRAINT "game-run-id" FOREIGN KEY("game-run") REFERENCES "game-runs"("id")
            );
        `);
    }

    onModuleDestroy(): void {
        this.db?.close();
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

    private getDb(): DatabaseSync {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        return this.db;
    }
}
