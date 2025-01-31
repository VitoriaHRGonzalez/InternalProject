import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { ReviewsController } from '../controllers/reviews.controller';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { ReviewsService } from '../services/reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'InternalProjectSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('reviews');
  }
}
