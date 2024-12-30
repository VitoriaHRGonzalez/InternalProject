import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../schemas/review.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class ReviewsRepository extends BaseRepository<Review> {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {
    super(reviewModel);
  }

  async findByMovieId(movieId: string): Promise<Review[]> {
    return this.reviewModel.find({ movieId }).exec();
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return this.reviewModel.find({ user: userId }).exec();
  }
}
