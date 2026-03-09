import { Controller, Get } from "@nestjs/common";
import { StatsService } from "./stats.service";
import type { Stats } from "./stats.service";
import { Req } from "@nestjs/common";
import type { SessionRequest } from "src/session/session-cookie.middleware";

@Controller("stats")
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get()
    getStats(@Req() req: SessionRequest): Stats {
        return this.statsService.getStats(req.sessionId);
    }
}