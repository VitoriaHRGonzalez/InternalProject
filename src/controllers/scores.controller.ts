import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ScoresService } from '../services/scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  async sendScore(
    @Body() body: { movieId: string; score: number },
    @Req() req: Request,
  ) {
    const userId = (req['user'] as any)?.sub;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.scoresService.sendScore(userId, body.movieId, body.score);
  }

  @Get(':movieId')
  async getScoresByMovie(@Param('movieId') movieId: string) {
    return this.scoresService.getScoresByMovieId(movieId);
  }
}
