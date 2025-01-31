import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoresController } from '../controllers/scores.controller';
import { JwtMiddleware } from '../middleware/jwt.middleware'; // Importa o middleware
import { ScoresRepository } from '../repositories/scores.repository';
import { Score, ScoreSchema } from '../schemas/score.schema';
import { ScoresService } from '../services/scores.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'InternalProjectSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ScoresController],
  providers: [ScoresService, ScoresRepository],
})
export class ScoresModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('scores');
  }
}
