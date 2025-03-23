import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/infrastructure/http/controllers/task/task.controller';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AssignTaskUseCase } from '@/application/use-cases/tasks/assign-task.use-case';
import { ListUsersOnTaskUseCase } from '@/application/use-cases/tasks/list-users-task.use-case';
import { UnassignTaskUseCase } from '@/application/use-cases/tasks/unassign-task.use-case';

/* eslint-disable @typescript-eslint/unbound-method */

describe('TaskController - Move Task', () => {
  let tasksController: TasksController;
  let moveTaskUseCase: MoveTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: MoveTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        CreateTaskUseCase,
        DeleteTaskUseCase,
        UpdateTaskUseCase,
        ListTasksUseCase,
        GetTaskByIdUseCase,
        AuthGuard,
        TaskRepository,
        PrismaService,
        JwtService,
        AssignTaskUseCase,
        UnassignTaskUseCase,
        ListUsersOnTaskUseCase,
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    moveTaskUseCase = module.get<MoveTaskUseCase>(MoveTaskUseCase);
  });

  describe('Move Task', () => {
    it('should move a task from one project to another', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Task description',
        projectId: 'project2',
      };
      jest.spyOn(moveTaskUseCase, 'execute').mockResolvedValue(mockTask);

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;
      const result = await tasksController.moveTask(req, '1', {
        fromProjectId: 'project1',
        toProjectId: 'project2',
      });

      expect(result).toEqual(mockTask);
      expect(moveTaskUseCase.execute).toHaveBeenCalledWith({
        taskId: '1',
        fromProjectId: 'project1',
        toProjectId: 'project2',
        userId: 'user1',
        userRole: 'ADMIN',
      });
    });

    it('should throw an error if moveTaskUseCase fails', async () => {
      jest
        .spyOn(moveTaskUseCase, 'execute')
        .mockRejectedValue(new Error('Failed to move task'));

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;

      await expect(
        tasksController.moveTask(req, '1', {
          fromProjectId: 'project1',
          toProjectId: 'project2',
        }),
      ).rejects.toThrow('Failed to move task');
    });
  });
});
