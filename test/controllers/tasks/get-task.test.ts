/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/infrastructure/http/controllers/task/task.controller';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { JwtService } from '@nestjs/jwt';
import { ListUsersOnTaskUseCase } from '@/application/use-cases/tasks/list-users-task.use-case';
import { UnassignTaskUseCase } from '@/application/use-cases/tasks/unassign-task.use-case';
import { AssignTaskUseCase } from '@/application/use-cases/tasks/assign-task.use-case';

describe('TasksController - Get Tasks', () => {
  let tasksController: TasksController;
  let getTaskByIdUseCase: GetTaskByIdUseCase;
  let listTasksUseCase: ListTasksUseCase;
  let listUsersOnTaskUseCase: ListUsersOnTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: GetTaskByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListTasksUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListUsersOnTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        CreateTaskUseCase,
        DeleteTaskUseCase,
        UpdateTaskUseCase,
        MoveTaskUseCase,
        AuthGuard,
        TaskRepository,
        PrismaService,
        JwtService,
        AssignTaskUseCase,
        UnassignTaskUseCase,
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    getTaskByIdUseCase = module.get<GetTaskByIdUseCase>(GetTaskByIdUseCase);
    listTasksUseCase = module.get<ListTasksUseCase>(ListTasksUseCase);
    listUsersOnTaskUseCase = module.get<ListUsersOnTaskUseCase>(
      ListUsersOnTaskUseCase,
    );
  });

  describe('Get Task By ID', () => {
    it('should return the details of a task', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        projectId: 'project1',
        description: 'Task description',
      };
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest.spyOn(getTaskByIdUseCase, 'execute').mockResolvedValue(mockTask);

      const result = await tasksController.getTaskById(req, '1');

      expect(result).toEqual(mockTask);
      expect(getTaskByIdUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        userId: mockUser.id,
        userRole: mockUser.role,
      });
    });

    it('should handle errors when getting a task by ID', async () => {
      const error = new Error('Task not found');
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest.spyOn(getTaskByIdUseCase, 'execute').mockRejectedValue(error);

      await expect(tasksController.getTaskById(req, '1')).rejects.toThrow(
        'Task not found',
      );
      expect(getTaskByIdUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        userId: mockUser.id,
        userRole: mockUser.role,
      });
    });
  });

  describe('Get Tasks', () => {
    it('should return a paginated list of tasks', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Task description',
          projectId: 'project1',
        },
      ];
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest.spyOn(listTasksUseCase, 'execute').mockResolvedValue({
        tasks: mockTasks,
        totalCount: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });

      const result = await tasksController.listTasks(req, 1, 10);

      expect(result).toEqual({
        tasks: mockTasks,
        totalCount: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(listTasksUseCase.execute).toHaveBeenCalledWith({
        userId: mockUser.id,
        userRole: mockUser.role,
        query: {
          projectId: undefined,
          status: undefined,
        },
        page: 1,
        perPage: 10,
      });
    });

    it('should handle errors when getting tasks', async () => {
      const error = new Error('Error fetching tasks');
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest.spyOn(listTasksUseCase, 'execute').mockRejectedValue(error);

      await expect(tasksController.listTasks(req, 1, 10)).rejects.toThrow(
        'Error fetching tasks',
      );
      expect(listTasksUseCase.execute).toHaveBeenCalledWith({
        userId: mockUser.id,
        userRole: mockUser.role,
        query: {
          projectId: undefined,
          status: undefined,
        },
        page: 1,
        perPage: 10,
      });
    });
  });

  describe('List Task Users', () => {
    it('should return a list of users assigned to a task', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@gmail.com',
          role: 'USER' as const,
          createdAt: new Date('2021-09-01T20:00:00.000Z'),
        },
      ];
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(listUsersOnTaskUseCase, 'execute')
        .mockResolvedValue(mockUsers);

      const result = await tasksController.listTaskUsers(req, '1');

      expect(result).toEqual(mockUsers);
      expect(listUsersOnTaskUseCase.execute).toHaveBeenCalledWith({
        taskId: '1',
        userId: mockUser.id,
        userRole: mockUser.role,
      });
    });

    it('should handle errors when listing users on a task', async () => {
      const error = new Error('Error fetching users');
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest.spyOn(listUsersOnTaskUseCase, 'execute').mockRejectedValue(error);

      await expect(tasksController.listTaskUsers(req, '1')).rejects.toThrow(
        'Error fetching users',
      );
      expect(listUsersOnTaskUseCase.execute).toHaveBeenCalledWith({
        taskId: '1',
        userId: mockUser.id,
        userRole: mockUser.role,
      });
    });
  });
});
