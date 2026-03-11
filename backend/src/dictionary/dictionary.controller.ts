import {
    Controller,
    Get,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import type { Dictionary } from '../../generated/prisma/client';

type UpsertEntryBody = {
    value?: string;
};

@Controller('dictionary')
export class DictionaryController {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    @Get('/random')
    async getRandomWord(): Promise<Dictionary> {
        const entry = await this.prismaService.getRandomWord();

        if (!entry) {
            throw new NotFoundException('No words found in the dictionary');
        }

        return entry;
    }

    @Get('/check/:word')
    async getWord(@Param('word') word: string): Promise<Dictionary> {
        const entry = await this.prismaService.getWord(word);

        if (!entry) {
            throw new NotFoundException('Word not found in the dictionary');
        }

        return entry;
    }
}