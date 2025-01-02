import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../controllers/users.controller';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'InternalProjectSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [MongooseModule, UsersRepository, JwtModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('users/login').forRoutes('users'); //Aplicar a somente para users?
  }
}
