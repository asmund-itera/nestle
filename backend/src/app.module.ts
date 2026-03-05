import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { DictionaryController } from './dictionary/dictionary.controller';
import { SqliteService } from './database/sqlite.service';

@Module({
  imports: [],
  controllers: [AppController, DictionaryController],
  providers: [AppService, SqliteService],
})
export class AppModule { }
