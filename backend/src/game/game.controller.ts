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

type GameRun = {
    id: number;
    date: string;
    session: string;
    guesses: string[];
};

@Controller('game')
export class GameController {
    constructor(private readonly sqliteService: SqliteService) { }

    @Get('/:session/:date')
    getGameRun(@Param('session') session: string, @Param('date') date: string): GameRun {
        const dbGameRun = this.sqliteService.getGameRunByDate(session, date)
            || this.sqliteService.createGameRun(date, session);

        return {
            ...dbGameRun,
            guesses: this.sqliteService.getGameRunGuesses(dbGameRun.id).map((guess) => guess.word)
        };
    }
}