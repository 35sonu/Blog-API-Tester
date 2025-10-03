import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserService = {
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const signUpData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'jwt.token.here';

      userService.findByUsername.mockResolvedValue(undefined);
      userService.findByEmail.mockResolvedValue(undefined);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userService.create.mockResolvedValue(createdUser);
      jwtService.sign.mockReturnValue(token);

      const result = await service.signUp(signUpData.username, signUpData.email, signUpData.password);

      expect(userService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userService.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result).toEqual({
        access_token: token,
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'testuser',
        email: 'existing@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.findByUsername.mockResolvedValue(existingUser);

      await expect(
        service.signUp('testuser', 'test@example.com', 'password123')
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'existinguser',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.findByUsername.mockResolvedValue(undefined);
      userService.findByEmail.mockResolvedValue(existingUser);

      await expect(
        service.signUp('testuser', 'test@example.com', 'password123')
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user with correct credentials', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = 'jwt.token.here';

      userService.findByUsername.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(token);

      const result = await service.signIn('testuser', 'password123');

      expect(userService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result).toEqual({
        access_token: token,
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      userService.findByUsername.mockResolvedValue(undefined);

      await expect(
        service.signIn('nonexistent', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.findByUsername.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        service.signIn('testuser', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
