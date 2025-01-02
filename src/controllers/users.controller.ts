// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.usersService.authenticate(email, password);
  }

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = body;

    // Validação de dados
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    // Tenta registrar o usuário
    return await this.usersService.register({ name, email, password });
  }
}
