import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const sqlitePath = join(tmpdir(), `nestle-e2e-${Date.now()}.db`);

  beforeAll(() => {
    process.env.SQLITE_PATH = sqlitePath;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(() => {
    delete process.env.SQLITE_PATH;
    rmSync(sqlitePath, { force: true });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('sets a session cookie when missing', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toContain('nestle_session=');
  });

  it('reuses session cookie when provided', async () => {
    const firstResponse = await request(app.getHttpServer()).get('/').expect(200);
    const cookieHeader: string = firstResponse.headers['set-cookie'][0];
    const sessionCookie = cookieHeader.split(';')[0];

    const secondResponse = await request(app.getHttpServer())
      .get('/')
      .set('Cookie', sessionCookie)
      .expect(200);

    expect(secondResponse.headers['set-cookie']).toBeUndefined();
  });

  it('rejects invalid guess payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/game/1/guess')
      .send({ word: 'abc' })
      .expect(400);

    expect(response.body.message).toContain('word must be a 5-letter string');
  });
});
