/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/infrastructure/http/controllers/task/task.controller';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { AssignTaskUseCase } from '@/application/use-cases/tasks/assign-task.use-case';
import { UnassignTaskUseCase } from '@/application/use-cases/tasks/unassign-task.use-case';
import { JwtService } from '@nestjs/jwt';

describe('TaskController - Update User', () => {
  let tasksController: TasksController;
  let updateTaskUseCase: UpdateTaskUseCase;
  let assignTaskUseCase: AssignTaskUseCase;
  let unassignTaskUseCase: UnassignTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: UpdateTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AssignTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UnassignTaskUseCase,
          useValue: { execute: jest.fn() },
        },
        CreateTaskUseCase,
        DeleteTaskUseCase,
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
    updateTaskUseCase = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
    assignTaskUseCase = module.get<AssignTaskUseCase>(AssignTaskUseCase);
    unassignTaskUseCase = module.get<UnassignTaskUseCase>(UnassignTaskUseCase);
  });

  describe('Update Task', () => {
    it('should update a task', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Task description',
        projectId: 'project1',
      };
      jest.spyOn(updateTaskUseCase, 'execute').mockResolvedValue(mockTask);

      const req = { user: { id: 'user1' } } as AuthRequest;
      const result = await tasksController.updateTask(
        req,
        {
          title: 'Updated Task',
        },
        '1',
      );

      expect(result).toEqual(mockTask);
      expect(updateTaskUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        taskData: {
          title: 'Updated Task',
        },
        user: req.user,
      });
    });
  });

  describe('Assign Task', () => {
    it('should assign a task to a user', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Task description',
        projectId: 'project1',
      };
      jest.spyOn(assignTaskUseCase, 'execute').mockResolvedValue(mockTask);

      const req = { user: { id: 'admin1', role: 'ADMIN' } } as AuthRequest;
      const result = await tasksController.assignTask(req, '1', {
        userId: 'user1',
      });

      expect(result).toEqual(mockTask);
      expect(assignTaskUseCase.execute).toHaveBeenCalledWith({
        taskId: '1',
        userId: 'user1',
        userRole: 'ADMIN',
      });
    });
  });

  describe('Unassign Task', () => {
    it('should unassign a task from a user', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Task description',
        projectId: 'project1',
      };
      jest.spyOn(unassignTaskUseCase, 'execute').mockResolvedValue(mockTask);

      const req = { user: { id: 'admin1', role: 'ADMIN' } } as AuthRequest;
      const result = await tasksController.unassignTask(req, '1', {
        userId: 'user1',
      });

      expect(result).toEqual(mockTask);
      expect(unassignTaskUseCase.execute).toHaveBeenCalledWith({
        taskId: '1',
        userId: 'user1',
        userRole: 'ADMIN',
      });
    });
  });
});
