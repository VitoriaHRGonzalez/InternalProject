import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@Body() body: any) {
    return this.favoritesService.addFavorite(body.userId, body.movieId);
  }

  @Get(':userId')
  async getFavoritesByUser(@Param('userId') userId: string) {
    return this.favoritesService.getFavoritesByUserId(userId);
  }
}
