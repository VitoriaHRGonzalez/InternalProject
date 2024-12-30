/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Welcome to the API! Use /users, /favorites, /scores, or /reviews to access the resources.';
  }
}
