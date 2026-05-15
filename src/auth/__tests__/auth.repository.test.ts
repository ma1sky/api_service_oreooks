import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../db/prisma';
import UserRepository from '../auth.repository';
import { Prisma } from '@prisma/client';
import type { User } from '../../config/types';

// Mock the prisma module
jest.mock('../../db/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        tg_id: 123,
        token: 'some-token',
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserRepository.getUser(123);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { tg_id: 123 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserRepository.getUser(999);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { tg_id: 999 },
      });
      expect(result).toBeNull();
    });

    it('should throw database error on prisma error', async () => {
      const error = new Error('DB connection failed');
      mockedPrisma.user.findUnique.mockRejectedValue(error);

      await expect(UserRepository.getUser(123)).rejects.toThrow(
        'Ошибка базы данных'
      );
    });
  });

  describe('createUser', () => {
    it('should create user and return user object', async () => {
      const mockUser: User = {
        tg_id: 123,
        token: 'new-token',
      };

      mockedPrisma.user.create.mockResolvedValue(mockUser);

      const result = await UserRepository.createUser('new-token', 123);

      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: { tg_id: 123, token: 'new-token' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw "Пользователь уже существует" on P2002 error', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '7.7.0',
        } as any
      );

      mockedPrisma.user.create.mockRejectedValue(prismaError);

      await expect(UserRepository.createUser('token', 123)).rejects.toThrow(
        'Пользователь уже существует'
      );
    });

    it('should throw "Ошибка базы данных" on other errors', async () => {
      const error = new Error('Some other error');
      mockedPrisma.user.create.mockRejectedValue(error);

      await expect(UserRepository.createUser('token', 123)).rejects.toThrow(
        'Ошибка базы данных'
      );
    });
  });
});