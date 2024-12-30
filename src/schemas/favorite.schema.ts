import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Favorite extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  movieId: string; // Vai vir da API das gurias?
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
