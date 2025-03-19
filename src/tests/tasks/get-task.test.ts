import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@/infrastructure/http/controllers/task.controller';
import { GetTaskByIdUseCase } from '@/application/use-cases/get-task-by-id.use-case';
import { GetTasksUseCase } from '@/application/use-cases/get-tasks.use-case';

describe('TaskController - Get Tasks', () => {
  let taskController: TaskController;
  let getTaskByIdUseCase: GetTaskByIdUseCase;
  let getTasksUseCase: GetTasksUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: GetTaskByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTasksUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    getTaskByIdUseCase = module.get<GetTaskByIdUseCase>(GetTaskByIdUseCase);
    getTasksUseCase = module.get<GetTasksUseCase>(GetTasksUseCase);
  });

  describe('Get Task By ID', () => {
    it('should return the details of a task', async () => {
      const mockTask = { id: '1', title: 'Test Task' };
      jest.spyOn(getTaskByIdUseCase, 'execute').mockResolvedValue(mockTask);

      const result = await taskController.getById('1');

      expect(result).toEqual(mockTask);
      expect(getTaskByIdUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('Get Tasks', () => {
    it('should return a paginated list of tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      jest.spyOn(getTasksUseCase, 'execute').mockResolvedValue(mockTasks);

      const result = await taskController.getAll({ page: 1, limit: 10 });

      expect(result).toEqual(mockTasks);
      expect(getTasksUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });
});
