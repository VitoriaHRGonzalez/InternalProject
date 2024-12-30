/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ name, email, password });
    return newUser.save();
  }
}
