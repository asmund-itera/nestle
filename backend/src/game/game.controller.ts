import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
} from '@nestjs/common';
import { GameRunService } from './game-run.service';
import type { GameRun } from './game-run.service';
import type { SessionRequest } from '../session/session-cookie.middleware';

type CreateGameRunGuessBody = {
    word?: string;
};

@Controller('game')
export class GameController {
    constructor(private readonly gameRunService: GameRunService) { }

    @Get('/:date')
    async getGameRun(@Req() req: SessionRequest, @Param('date') date: string): Promise<GameRun> {
        return this.gameRunService.getOrCreateGameRun(req.sessionId, new Date(date));
    }

    @Post('/:gameRunId/guess')
    async createGameRunGuess(
        @Param('gameRunId', ParseIntPipe) gameRunId: number,
        @Body() body: CreateGameRunGuessBody,
    ): Promise<GameRun> {
        if (!body.word || !/^[a-z]{5}$/i.test(body.word)) {
            throw new BadRequestException('word must be a 5-letter string');
        }

        const gameRun = await this.gameRunService.getGameRun(gameRunId);
        return this.gameRunService.createGameRunGuess(
            gameRunId,
            body.word.toLowerCase(),
            gameRun.date,
        );
    }
}