import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewsRepository } from '../repositories/reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async sendReview(
    userId: string,
    movieId: string,
    comment: string,
    rating: number,
  ) {
    if (!rating) {
      throw new BadRequestException('Rating is required');
    }
    const existingReview = await this.reviewsRepository.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this movie');
    }

    const review = await this.reviewsRepository.create({
      userId,
      movieId,
      comment,
      rating,
    });

    return {
      message: 'Review submitted successfully',
      review,
    };
  }

  async getReviewsByMovieId(movieId: string) {
    const reviews = await this.reviewsRepository.findByMovieId(movieId);

    // Agora dá para tirar a média das avaliações
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length || 0;

    return {
      movieId,
      averageRating,
      reviews,
    };
  }

  async addLikeReview(reviewId: string) {
    const review = await this.reviewsRepository.findById(reviewId);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    review.likes += 1;
    await review.save();

    return {
      message: 'Review liked successfully',
      review,
    };
  }
}
