import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../schemas/review.schema';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async create(data: {
    userId: string;
    movieId: string;
    comment: string;
    rating: number;
  }): Promise<Review> {
    const newReview = new this.reviewModel(data);
    return newReview.save();
  }

  async findByUserAndMovie(
    userId: string,
    movieId: string,
  ): Promise<Review | null> {
    return this.reviewModel.findOne({ userId, movieId }).exec();
  }

  async findByMovieId(movieId: string): Promise<Review[]> {
    return this.reviewModel.find({ movieId }).exec();
  }

  async findById(reviewId: string): Promise<Review | null> {
    return this.reviewModel.findById(reviewId).exec();
  }
}
