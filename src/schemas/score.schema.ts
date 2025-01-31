import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Score extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
