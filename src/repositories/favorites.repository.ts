import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../schemas/favorite.schema';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
  ) {}

  async create(data: {
    userId: string;
    movieId: string;
    genre: string;
  }): Promise<Favorite> {
    const newFavorite = new this.favoriteModel(data);
    return newFavorite.save();
  }

  async findByUserAndMovie(
    userId: string,
    movieId: string,
  ): Promise<Favorite | null> {
    return this.favoriteModel.findOne({ userId, movieId }).exec();
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ userId }).exec();
  }
}
