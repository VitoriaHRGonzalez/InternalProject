import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from '../services/reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async sendReview(
    @Body() body: { movieId: string; comment: string; rating: number },
    @Req() req: Request,
  ) {
    const userId = (req['user'] as any)?.sub;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.reviewsService.sendReview(
      userId,
      body.movieId,
      body.comment,
      body.rating,
    );
  }

  @Get(':movieId')
  async getReviewsByMovie(@Param('movieId') movieId: string) {
    return this.reviewsService.getReviewsByMovieId(movieId);
  }

  @Patch(':reviewId/like')
  async likeReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.addLikeReview(reviewId);
  }
}
