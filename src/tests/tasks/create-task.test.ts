import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@/infrastructure/http/controllers/task.controller';
import { CreateTaskUseCase } from '@/application/use-cases/create-task.use-case';

describe('TaskController - Create Task', () => {
  let taskController: TaskController;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    createTaskUseCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  it('should create a task successfully', async () => {
    const mockTask = { id: '1', title: 'Test Task', description: 'Task description' };
    jest.spyOn(createTaskUseCase, 'execute').mockResolvedValue(mockTask);

    const result = await taskController.create({
      title: 'Test Task',
      description: 'Task description',
    });

    expect(result).toEqual(mockTask);
    expect(createTaskUseCase.execute).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Task description',
    });
  });

  it('should handle errors when creating a task', async () => {
    const error = new Error('Error creating task');
    jest.spyOn(createTaskUseCase, 'execute').mockRejectedValue(error);

    await expect(
      taskController.create({
        title: 'Test Task',
        description: 'Task description',
      }),
    ).rejects.toThrow('Error creating task');
  });
});
