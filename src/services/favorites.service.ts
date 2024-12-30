import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FavoritesRepository } from '../repositories/favorites.repository';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async addFavorite(userId: string, movieId: string) {
    return this.favoritesRepository.create({
      user: new Types.ObjectId(userId),
      movieId,
    });
  }

  async getFavoritesByUserId(userId: string) {
    return this.favoritesRepository.findByUserId(userId);
  }
}
