import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa o JwtModule
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesController } from '../controllers/favorites.controller';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { Favorite, FavoriteSchema } from '../schemas/favorite.schema';
import { FavoritesService } from '../services/favorites.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'InternalProjectSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('favorites');
  }
}
