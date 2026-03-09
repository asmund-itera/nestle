import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Put,
} from '@nestjs/common';
import { SqliteService } from '../database/sqlite.service';
import type { DictionaryEntry } from '../database/sqlite.service';
import { PrismaService } from 'src/prisma/prisma.service';

type UpsertEntryBody = {
    value?: string;
};

@Controller('dictionary')
export class DictionaryController {
    constructor(
        private readonly sqliteService: SqliteService,
        private readonly prismaService: PrismaService
    ) { }

    @Get('/random')
    getRandomWord(): DictionaryEntry {
        const entry = this.sqliteService.getRandomWord();

        if (!entry) {
            throw new NotFoundException('No words found in the dictionary');
        }

        return entry;
    }

    @Get('/check/:word')
    async getWord(@Param('word') word: string): Promise<DictionaryEntry> {
        const entry = await this.prismaService.getWord(word);

        if (!entry) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        return entry;
    }
}