import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const SESSION_COOKIE_NAME = 'nestle_session';

export type SessionRequest = Request & {
  sessionId: string;
};

@Injectable()
export class SessionCookieMiddleware implements NestMiddleware {
  use(req: SessionRequest, res: Response, next: NextFunction): void {
    let sessionId = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;

    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    }

    req.sessionId = sessionId;
    next();
  }
}
