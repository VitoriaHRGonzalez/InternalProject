import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoresController } from '../controllers/scores.controller';
import { ScoresRepository } from '../repositories/scores.repository';
import { Score, ScoreSchema } from '../schemas/score.schema';
import { ScoresService } from '../services/scores.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
  ],
  controllers: [ScoresController],
  providers: [ScoresRepository, ScoresService],
  exports: [ScoresRepository],
})
export class ScoresModule {}
