import { BadRequestException, Injectable } from '@nestjs/common';
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
    return this.userModel.find().exec();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { name, email, password } = data;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return newUser;
  }

  // Autenticação de usuário
  async authenticate(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    console.log('Authenticating user with email:', email);

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.error('User not found');
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    console.log('Authentication successful, token generated:', token);

    return { token };
  }
}
