import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { FavoritesService } from '../services/favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(
    @Body() body: { movieId: string; genre: string },
    @Req() req: Request,
  ) {
    const userId = (req['user'] as any)?.sub;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.favoritesService.addFavorite(userId, body.movieId, body.genre);
  }

  @Get(':userId')
  async getFavoritesByUser(@Param('userId') userId: string) {
    return this.favoritesService.getFavoritesByUserId(userId);
  }
}
