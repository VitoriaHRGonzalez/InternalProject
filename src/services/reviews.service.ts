import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReviewsRepository } from '../repositories/reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async addReview(userId: string, movieId: string, comment: string) {
    return this.reviewsRepository.create({
      user: new Types.ObjectId(userId),
      movieId,
      comment,
    });
  }

  async getReviewsByMovieId(movieId: string) {
    return this.reviewsRepository.findByMovieId(movieId);
  }
}
