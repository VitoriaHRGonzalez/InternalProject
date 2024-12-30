import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Score, ScoreSchema } from './schemas/score.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Favorite.name, schema: FavoriteSchema },
      { name: Score.name, schema: ScoreSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class UserModule {}
