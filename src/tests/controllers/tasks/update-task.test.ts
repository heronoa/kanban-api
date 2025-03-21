import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@/infrastructure/http/controllers/task.controller';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.use-case';

describe('TaskController - Update User', () => {
  let taskController: TaskController;
  let updateTaskUseCase: UpdateTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: UpdateTaskUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    updateTaskUseCase = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
  });

  describe('Update Task', () => {
    it('should update a task', async () => {
      const mockTask = { id: '1', title: 'Task 1' };
      jest.spyOn(updateTaskUseCase, 'execute').mockResolvedValue(mockTask);

      const result = await taskController.update('1', {
        title: 'Updated Task',
      });

      expect(result).toEqual(mockTask);
      expect(updateTaskUseCase.execute).toHaveBeenCalledWith('1', {
        title: 'Updated Task',
      });
    });
  });
});
