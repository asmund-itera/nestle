import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DictionaryController } from './dictionary/dictionary.controller';
import { SqliteService } from './database/sqlite.service';
import { GameController } from './game/game.controller';
import { GameRunService } from './game/game-run.service';
import { SessionCookieMiddleware } from './session/session-cookie.middleware';
import { StatsController } from './stats/stats.controller';
import { PRISMA_SERVICE_TOKEN, StatsService } from './stats/stats.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [],
  controllers: [DictionaryController, GameController, StatsController],
  providers: [
    GameRunService,
    StatsService,
    PrismaService,
    {
      provide: PRISMA_SERVICE_TOKEN,
      useExisting: PrismaService,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SessionCookieMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
