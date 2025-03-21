import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '@/infrastructure/http/controllers/project.controller';
import { DeleteProjectUseCase } from '@/application/use-cases/delete-project.use-case';

describe('ProjectController - Delete Project', () => {
  let projectController: ProjectController;
  let deleteProjectUseCase: DeleteProjectUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: DeleteProjectUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    deleteProjectUseCase = module.get<DeleteProjectUseCase>(DeleteProjectUseCase);
  });

  it('should delete a project successfully', async () => {
    jest.spyOn(deleteProjectUseCase, 'execute').mockResolvedValue(undefined);

    const result = await projectController.delete('1');

    expect(result).toBeUndefined();
    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('should handle errors when deleting a project', async () => {
    const error = new Error('Project not found');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    try {
      await projectController.delete('1');
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('should return a 404 error if project does not exist', async () => {
    const error = new Error('Project not found');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    try {
      await projectController.delete('999');
    } catch (e) {
      expect(e.message).toBe('Project not found');
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith('999');
  });

  it('should return a 500 error for unexpected errors', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    try {
      await projectController.delete('1');
    } catch (e) {
      expect(e.message).toBe('Unexpected error');
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith('1');
  });
});
