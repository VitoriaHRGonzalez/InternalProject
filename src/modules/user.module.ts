import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../controllers/users.controller';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [MongooseModule, UsersRepository, JwtModule],
})
export class UsersModule {}
