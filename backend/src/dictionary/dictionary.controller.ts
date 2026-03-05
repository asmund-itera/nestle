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

type UpsertEntryBody = {
    value?: string;
};

@Controller('dictionary')
export class DictionaryController {
    constructor(private readonly sqliteService: SqliteService) { }

    @Get('/random')
    getRandomWord(): DictionaryEntry {
        const entry = this.sqliteService.getRandomWord();

        if (!entry) {
            throw new NotFoundException('No words found in the dictionary');
        }

        return entry;
    }

    @Get('/check/:word')
    getWord(@Param('word') word: string): DictionaryEntry {
        const entry = this.sqliteService.getWord(word);

        if (!entry) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        return entry;
    }
}