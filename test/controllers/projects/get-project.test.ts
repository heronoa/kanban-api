/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '@/infrastructure/http/controllers/projects/projects.controller';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
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
        {
          provide: ListProjectsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetProjectByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteProjectUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateProjectUseCase,
          useValue: { execute: jest.fn() },
        },
        PrismaService,
        ProjectRepository,
        AuthGuard,
        JwtService,
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    createProjectUseCase =
      module.get<CreateProjectUseCase>(CreateProjectUseCase);
  });

  describe('Create Project', () => {
    it('should create a new project and return its details', async () => {
      const mockProject = {
        id: '1',
        name: 'New Project',
        ownerId: '1',
        description: 'New Project Description',
      };
      const createProjectDto = {
        name: 'New Project',
        ownerId: '1',
        description: 'New Project Description',
      };
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(createProjectUseCase, 'execute')
        .mockResolvedValue(mockProject);

      const result = await projectsController.createProject(
        req,
        createProjectDto,
      );

      expect(result).toEqual(mockProject);
      expect(createProjectUseCase.execute).toHaveBeenCalledWith(
        createProjectDto,
        mockUser,
      );
    });

    it('should throw an error if project creation fails', async () => {
      const createProjectDto = {
        name: 'New Project',
        ownerId: '1',
        description: 'New Project Description',
      };
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(createProjectUseCase, 'execute')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(
        projectsController.createProject(req, createProjectDto),
      ).rejects.toThrow('Creation failed');
      expect(createProjectUseCase.execute).toHaveBeenCalledWith(
        createProjectDto,
        mockUser,
      );
    });
  });
});
