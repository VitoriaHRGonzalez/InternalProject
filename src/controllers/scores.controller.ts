import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScoresService } from '../services/scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  async addScore(@Body() body: any) {
    return this.scoresService.addScore(body.userId, body.movieId, body.score);
  }

  @Get(':movieId')
  async getScoresByMovie(@Param('movieId') movieId: string) {
    return this.scoresService.getScoresByMovieId(movieId);
  }
}
