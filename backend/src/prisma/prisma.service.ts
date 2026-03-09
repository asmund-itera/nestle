// service that mirrors sqlite service but uses prisma instead of sqlite
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

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

    getWord(word: string): Promise<{ word: string } | null> {
        return this.dictionary.findUnique({
            where: { word },
        });
    }

    async getRandomWord(): Promise<{ word: string } | null> {
        const rows = await this.$queryRaw<Array<{ word: string }>>`
            SELECT word
            FROM "game-words"
            ORDER BY RANDOM()
            LIMIT 1
        `;

        return rows[0] ?? null;
    }
}