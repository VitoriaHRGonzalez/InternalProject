import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec(); // Busca todos os documentos na coleção `users`
  }

  async createUser(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({ ...data, password: hashedPassword });
    return newUser.save();
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    console.log('Authenticating user with email:', email);

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.error('User not found');
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      throw new Error('Invalid email or password');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    console.log('Authentication successful, token generated:', token);

    return { token };
  }
}
