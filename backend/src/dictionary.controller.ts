import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { SqliteService } from './sqlite.service';
import type { DictionaryEntry } from './sqlite.service';

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
}
