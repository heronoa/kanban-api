/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/infrastructure/http/controllers/task/task.controller';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { JwtService } from '@nestjs/jwt';

describe('TasksController - Delete Task', () => {
  let tasksController: TasksController;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: DeleteTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        CreateTaskUseCase,
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
    deleteTaskUseCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  it('should delete a task successfully', async () => {
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    const mockTask = {
      id: '1',
      title: 'Test Task',
      projectId: 'project1',
      description: 'Task description',
    };
    jest.spyOn(deleteTaskUseCase, 'execute').mockResolvedValue(mockTask);

    const result = await tasksController.deleteTask(req, '1');

    expect(result).toEqual(mockTask);
    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: mockUser,
    });
  });

  it('should handle errors when deleting a task', async () => {
    const error = new Error('Task not found');
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    jest.spyOn(deleteTaskUseCase, 'execute').mockRejectedValue(error);

    await expect(tasksController.deleteTask(req, '1')).rejects.toThrow(
      'Task not found',
    );
    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: mockUser,
    });
  });
});
