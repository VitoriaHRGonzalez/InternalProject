import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score } from '../schemas/score.schema';

@Injectable()
export class ScoresRepository {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
  ) {}

  async create(data: {
    userId: string;
    movieId: string;
    score: number;
  }): Promise<Score> {
    const newScore = new this.scoreModel(data);
    return newScore.save();
  }

  async findByUserAndMovie(
    userId: string,
    movieId: string,
  ): Promise<Score | null> {
    return this.scoreModel.findOne({ userId, movieId }).exec();
  }

  async findByMovieId(movieId: string): Promise<Score[]> {
    return this.scoreModel.find({ movieId }).exec();
  }
}
