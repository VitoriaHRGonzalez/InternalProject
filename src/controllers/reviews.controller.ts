import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async addReview(@Body() body: any) {
    return this.reviewsService.addReview(
      body.userId,
      body.movieId,
      body.comment,
    );
  }

  @Get(':movieId')
  async getReviewsByMovie(@Param('movieId') movieId: string) {
    return this.reviewsService.getReviewsByMovieId(movieId);
  }
}
