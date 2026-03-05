import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { GameRunService } from './game-run.service';
import type { GameRun } from './game-run.service';

type CreateGameRunGuessBody = {
    word?: string;
};

@Controller('game')
export class GameController {
    constructor(private readonly gameRunService: GameRunService) { }

    @Get('/:session/:date')
    getGameRun(@Param('session') session: string, @Param('date') date: string): GameRun {
        return this.gameRunService.getOrCreateGameRun(session, date);
    }

    @Post('/:gameRunId/guess')
    createGameRunGuess(
        @Param('gameRunId', ParseIntPipe) gameRunId: number,
        @Body() body: CreateGameRunGuessBody,
    ): GameRun {
        if (!body.word || !/^[a-z]{5}$/i.test(body.word)) {
            throw new BadRequestException('word must be a 5-letter string');
        }

        const gameRun = this.gameRunService.getGameRun(gameRunId);
        return this.gameRunService.createGameRunGuess(
            gameRunId,
            body.word.toLowerCase(),
            gameRun.date,
        );
    }
}