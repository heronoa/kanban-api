/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '@/infrastructure/http/controllers/projects/projects.controller';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ProjectsController - Create Project', () => {
  let projectsController: ProjectsController;
  let createProjectUseCase: CreateProjectUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: CreateProjectUseCase,
          useValue: { execute: jest.fn() },
        },
        PrismaService,
        ProjectRepository,
        AuthGuard,
        ListProjectsUseCase,
        UpdateProjectUseCase,
        DeleteProjectUseCase,
        GetProjectByIdUseCase,
        JwtService,
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    createProjectUseCase =
      module.get<CreateProjectUseCase>(CreateProjectUseCase);
  });

  it('should create a project successfully', async () => {
    const mockProject = {
      id: '1',
      name: 'Test Project',
      description: 'Project description',
      ownerId: '1',
    };
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    jest.spyOn(createProjectUseCase, 'execute').mockResolvedValue(mockProject);

    const result = await projectsController.createProject(req, {
      name: 'Test Project',
      description: 'Project description',
      ownerId: '1',
    });

    expect(result).toEqual(mockProject);
    expect(createProjectUseCase.execute).toHaveBeenCalledWith(
      {
        name: 'Test Project',
        description: 'Project description',
        ownerId: '1',
      },
      mockUser,
    );
  });

  it('should handle errors when creating a project', async () => {
    const error = new Error('Error creating project');
    const mockUser = { id: 'user1', role: 'admin' };
    const req = { user: mockUser } as AuthRequest;
    jest.spyOn(createProjectUseCase, 'execute').mockRejectedValue(error);

    await expect(
      projectsController.createProject(req, {
        name: 'Test Project',
        description: 'Project description',
        ownerId: '',
      }),
    ).rejects.toThrow('Error creating project');
  });
});
