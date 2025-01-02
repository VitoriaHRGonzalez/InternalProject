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

  // Busca todos os usuários
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Registro de novo usuário
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { name, email, password } = data;

    // Valida se o email já está em uso
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Validações adicionais (senha forte, nome obrigatório)
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria e salva o novo usuário
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  // Autenticação de usuário
  async authenticate(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    console.log('Authenticating user with email:', email);

    // Busca o usuário pelo email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.error('User not found');
      throw new BadRequestException('Invalid email or password');
    }

    // Compara a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      throw new BadRequestException('Invalid email or password');
    }

    // Gera o token JWT
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    console.log('Authentication successful, token generated:', token);

    return { token };
  }
}
