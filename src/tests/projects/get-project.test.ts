import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '@/infrastructure/http/controllers/project.controller';
import { CreateProjectUseCase } from '@/application/use-cases/create-project.use-case';

describe('ProjectController - Create Project', () => {
  let projectController: ProjectController;
  let createProjectUseCase: CreateProjectUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: CreateProjectUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    createProjectUseCase = module.get<CreateProjectUseCase>(CreateProjectUseCase);
  });

  describe('Create Project', () => {
    it('should create a new project and return its details', async () => {
      const mockProject = { id: '1', name: 'New Project' };
      const createProjectDto = { name: 'New Project' };
      jest.spyOn(createProjectUseCase, 'execute').mockResolvedValue(mockProject);

      const result = await projectController.create(createProjectDto);

      expect(result).toEqual(mockProject);
      expect(createProjectUseCase.execute).toHaveBeenCalledWith(createProjectDto);
    });

    it('should throw an error if project creation fails', async () => {
      const createProjectDto = { name: 'New Project' };
      jest.spyOn(createProjectUseCase, 'execute').mockRejectedValue(new Error('Creation failed'));

      await expect(projectController.create(createProjectDto)).rejects.toThrow('Creation failed');
      expect(createProjectUseCase.execute).toHaveBeenCalledWith(createProjectDto);
    });
  });
});
