import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Score extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
