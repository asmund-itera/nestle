import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DictionaryController } from './dictionary.controller';
import { SqliteService } from './sqlite.service';

@Module({
  imports: [],
  controllers: [AppController, DictionaryController],
  providers: [AppService, SqliteService],
})
export class AppModule { }
