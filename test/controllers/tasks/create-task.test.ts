/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/infrastructure/http/controllers/task/task.controller';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('TasksController - Create and Move Task', () => {
  let tasksController: TasksController;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: { execute: jest.fn() },
        },

        DeleteTaskUseCase,
        UpdateTaskUseCase,
        ListTasksUseCase,
        MoveTaskUseCase,
        GetTaskByIdUseCase,
        AuthGuard,
        TaskRepository,
        PrismaService,
        JwtService,
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    createTaskUseCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  it('should create a task successfully', async () => {
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: 'Task description',
      projectId: 'project1',
    };
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    jest.spyOn(createTaskUseCase, 'execute').mockResolvedValue(mockTask);

    const result = await tasksController.createTask(req, {
      title: 'Test Task',
      description: 'Task description',
      projectId: '1',
    });

    expect(result).toEqual(mockTask);
    expect(createTaskUseCase.execute).toHaveBeenCalledWith(
      { title: 'Test Task', description: 'Task description', projectId: '1' },
      mockUser,
    );
  });

  it('should handle errors when creating a task', async () => {
    const error = new Error('Error creating task');
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    jest.spyOn(createTaskUseCase, 'execute').mockRejectedValue(error);

    await expect(
      tasksController.createTask(req, {
        title: 'Test Task',
        description: 'Task description',
        projectId: '1',
      }),
    ).rejects.toThrow('Error creating task');
  });
});
