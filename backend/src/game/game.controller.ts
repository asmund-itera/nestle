import { Controller, Get, Param, Post } from '@nestjs/common';
import { GameRunService } from './game-run.service';
import type { GameRun } from './game-run.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameRunService: GameRunService) { }

    @Get('/:session/:date')
    getGameRun(@Param('session') session: string, @Param('date') date: string): GameRun {
        return this.gameRunService.getOrCreateGameRun(session, date);
    }

    @Post('/:gameRunId/guess')
    createGameRunGuess(
        @Param('gameRunId') gameRunId: number,
        @Param('word') word: string,
    ): GameRun {
        const gameRun = this.gameRunService.getGameRun(gameRunId);
        return this.gameRunService.createGameRunGuess(gameRunId, word, gameRun.date);
    }
}