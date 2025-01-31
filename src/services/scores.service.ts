import { BadRequestException, Injectable } from '@nestjs/common';
import { ScoresRepository } from '../repositories/scores.repository';

@Injectable()
export class ScoresService {
  constructor(private readonly scoresRepository: ScoresRepository) {}

  async sendScore(userId: string, movieId: string, score: number) {
    // Validação: Limitar um score por usuário por filme
    const existingScore = await this.scoresRepository.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingScore) {
      throw new BadRequestException('You have already scored this movie');
    }

    const scoreData = await this.scoresRepository.create({
      userId,
      movieId,
      score,
    });

    return {
      message: 'Score submitted successfully',
      score: scoreData,
    };
  }

  async getScoresByMovieId(movieId: string) {
    const scores = await this.scoresRepository.findByMovieId(movieId);

    // Calcular a média dos scores
    const averageScore =
      scores.reduce((sum, score) => sum + score.score, 0) / scores.length || 0;

    return {
      movieId,
      averageScore,
      scores,
    };
  }
}
