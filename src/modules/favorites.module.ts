import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesController } from '../controllers/favorites.controller';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { Favorite, FavoriteSchema } from '../schemas/favorite.schema';
import { FavoritesService } from '../services/favorites.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesRepository, FavoritesService],
  exports: [FavoritesRepository],
})
export class FavoritesModule {}
