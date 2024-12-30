import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score } from '../schemas/score.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class ScoresRepository extends BaseRepository<Score> {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
  ) {
    super(scoreModel);
  }

  async findByMovieId(movieId: string): Promise<Score[]> {
    return this.scoreModel.find({ movieId }).exec();
  }

  async findByUserId(userId: string): Promise<Score[]> {
    return this.scoreModel.find({ user: userId }).exec();
  }
}
