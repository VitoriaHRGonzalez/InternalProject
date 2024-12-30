import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from '../controllers/reviews.controller';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { ReviewsService } from '../services/reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsRepository, ReviewsService],
  exports: [ReviewsRepository],
})
export class ReviewsModule {}
