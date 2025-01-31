import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      create: jest.fn().mockImplementation((user) => ({
        ...user,
        save: jest.fn().mockResolvedValue(user),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw error if email is already in use', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ email: 'usuario.um@example.com' }),
      } as any);

      await expect(
        service.register({
          name: 'Usuário um',
          email: 'usuario.um@example.com',
          password: 'SenhaSegura123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash password and save user', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const hashedPassword =
        '$2b$10$QUFolO7FQzSO3JNxZGBi0.NRj.EbsmTgBoAg7X1LlVRTzeOQgwQ1q';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      jest.spyOn(userModel, 'create').mockImplementationOnce(
        (user: any) =>
          ({
            ...user,
            save: jest.fn().mockResolvedValue(user),
          }) as any,
      );

      const result = await service.register({
        name: 'Usuário um',
        email: 'usuario.um@example.com',
        password: 'SenhaSegura123',
      });

      expect(userModel.create).toHaveBeenCalledWith({
        name: 'Usuário um',
        email: 'usuario.um@example.com',
        password: hashedPassword,
      });
      expect(result).toMatchObject({
        name: 'Usuário um',
        email: 'usuario.um@example.com',
        password: hashedPassword,
      });
    });
  });

  describe('authenticate', () => {
    it('should throw error if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.authenticate('usuario.um@example.com', 'SenhaSegura123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate user and return token', async () => {
      const user = {
        _id: 'userId',
        email: 'usuario.um@example.com',
        password: 'SenhaSegura123',
      };

      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken123');

      const result = await service.authenticate(
        'usuario.um@example.com',
        'SenhaSegura123',
      );

      expect(result).toEqual({ token: 'jwtToken123' });
    });
  });
});
