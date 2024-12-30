import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../schemas/favorite.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class FavoritesRepository extends BaseRepository<Favorite> {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
  ) {
    super(favoriteModel);
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ user: userId }).exec();
  }
}
