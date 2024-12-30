import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ScoresRepository } from '../repositories/scores.repository';

@Injectable()
export class ScoresService {
  constructor(private readonly scoresRepository: ScoresRepository) {}

  async addScore(userId: string, movieId: string, score: number) {
    return this.scoresRepository.create({
      user: new Types.ObjectId(userId),
      movieId,
      score,
    });
  }

  async getScoresByMovieId(movieId: string) {
    return this.scoresRepository.findByMovieId(movieId);
  }
}
