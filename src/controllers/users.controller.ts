import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.usersService.authenticate(email, password);
  }
}
