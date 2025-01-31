import { BadRequestException, Injectable } from '@nestjs/common';
import { FavoritesRepository } from '../repositories/favorites.repository';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async addFavorite(
    userId: string,
    movieId: string,
    genre: string,
  ): Promise<any> {
    const existingFavorite = await this.favoritesRepository.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingFavorite) {
      throw new BadRequestException('This movie is already in your favorites');
    }

    const favorite = await this.favoritesRepository.create({
      userId,
      movieId,
      genre,
    });

    return {
      message: 'Movie added to favorites successfully',
      favorite,
    };
  }

  async getFavoritesByUserId(userId: string): Promise<any[]> {
    return this.favoritesRepository.findByUserId(userId);
  }
}
