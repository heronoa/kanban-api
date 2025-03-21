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

  it('should create a project successfully', async () => {
    const mockProject = { id: '1', name: 'Test Project', description: 'Project description' };
    jest.spyOn(createProjectUseCase, 'execute').mockResolvedValue(mockProject);

    const result = await projectController.create({
      name: 'Test Project',
      description: 'Project description',
    });

    expect(result).toEqual(mockProject);
    expect(createProjectUseCase.execute).toHaveBeenCalledWith({
      name: 'Test Project',
      description: 'Project description',
    });
  });

  it('should handle errors when creating a project', async () => {
    const error = new Error('Error creating project');
    jest.spyOn(createProjectUseCase, 'execute').mockRejectedValue(error);

    await expect(
      projectController.create({
        name: 'Test Project',
        description: 'Project description',
      }),
    ).rejects.toThrow('Error creating project');
  });

  it('should validate missing project name', async () => {
    await expect(
      projectController.create({
        name: '',
        description: 'Project description',
      }),
    ).rejects.toThrow('Project name is required');
  });

  it('should validate missing project description', async () => {
    await expect(
      projectController.create({
        name: 'Test Project',
        description: '',
      }),
    ).rejects.toThrow('Project description is required');
  });
});
