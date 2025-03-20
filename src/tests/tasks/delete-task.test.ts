import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@/infrastructure/http/controllers/task.controller';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.use-case';

describe('TaskController - Delete Task', () => {
  let taskController: TaskController;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: DeleteTaskUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    deleteTaskUseCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  it('should delete a task successfully', async () => {
    jest.spyOn(deleteTaskUseCase, 'execute').mockResolvedValue(undefined);

    const result = await taskController.delete('1');

    expect(result).toBeUndefined();
    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('should handle errors when deleting a task', async () => {
    const error = new Error('Task not found');
    jest.spyOn(deleteTaskUseCase, 'execute').mockRejectedValue(error);

    try {
      await taskController.delete('1');
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith('1');
  });
});
