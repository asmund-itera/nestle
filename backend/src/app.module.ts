import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { DictionaryController } from './dictionary/dictionary.controller';
import { SqliteService } from './database/sqlite.service';
import { GameController } from './game/game.controller';
import { GameRunService } from './game/game-run.service';
import { SessionCookieMiddleware } from './session/session-cookie.middleware';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, DictionaryController, GameController, StatsController],
  providers: [AppService, SqliteService, GameRunService, StatsService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SessionCookieMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
