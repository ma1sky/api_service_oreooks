import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../db/prisma';
import TaskRepository from '../task.repository';
import { Prisma, TaskState } from '@prisma/client';
import type { TaskResponseDto } from '../../config/types';

// Mock the prisma module
jest.mock('../../db/prisma', () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('TaskRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return TaskResponseDto', async () => {
      const mockTaskInput: Prisma.TaskUncheckedCreateInput = {
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
      };

      const mockCreatedTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.task.create.mockResolvedValue(mockCreatedTask);

      const result = await TaskRepository.createTask(mockTaskInput);

      expect(mockedPrisma.task.create).toHaveBeenCalledWith({
        data: mockTaskInput,
      });
      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
      });
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await TaskRepository.getTaskById(1);

      expect(mockedPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
      });
    });

    it('should return null when task not found', async () => {
      mockedPrisma.task.findUnique.mockResolvedValue(null);

      const result = await TaskRepository.getTaskById(999);

      expect(mockedPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('getTasksByTgId', () => {
    it('should return tasks for given authorId', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          deadline: new Date('2025-01-01'),
          authorId: 123,
          state: TaskState.draft,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Desc 2',
          deadline: new Date('2025-01-02'),
          authorId: 123,
          state: TaskState.completed,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockedPrisma.task.findMany.mockResolvedValue(mockTasks);

      const result = await TaskRepository.getTasksByTgId(123);

      expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
        where: { authorId: 123 },
        orderBy: { deadline: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          deadline: true,
          authorId: true,
          state: true,
        },
      });
      expect(result).toEqual([
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          deadline: new Date('2025-01-01'),
          authorId: 123,
          state: TaskState.draft,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Desc 2',
          deadline: new Date('2025-01-02'),
          authorId: 123,
          state: TaskState.completed,
        },
      ]);
    });

    it('should return empty array when no tasks', async () => {
      mockedPrisma.task.findMany.mockResolvedValue([]);

      const result = await TaskRepository.getTasksByTgId(456);

      expect(result).toEqual([]);
    });
  });

  describe('updateTask', () => {
    it('should update task and return updated TaskResponseDto', async () => {
      const updateData: Prisma.TaskUpdateInput = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const mockUpdatedTask = {
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await TaskRepository.updateTask(1, updateData);

      expect(mockedPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual({
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return deleted TaskResponseDto', async () => {
      const mockTask = {
        id: 1,
        title: 'Task to delete',
        description: 'Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockedPrisma.task.delete.mockResolvedValue(mockTask);

      const result = await TaskRepository.deleteTask(1);

      expect(mockedPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockedPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({
        id: 1,
        title: 'Task to delete',
        description: 'Description',
        deadline: new Date('2025-01-01'),
        authorId: 123,
        state: TaskState.draft,
      });
    });

    it('should return null when task not found', async () => {
      mockedPrisma.task.findUnique.mockResolvedValue(null);

      const result = await TaskRepository.deleteTask(999);

      expect(mockedPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(mockedPrisma.task.delete).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});