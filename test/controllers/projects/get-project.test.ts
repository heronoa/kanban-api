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
import { AddMemberToProjectsUseCase } from '@/application/use-cases/projects/add-member-project.use-case';
import { RemoveMemberToProjectsUseCase } from '@/application/use-cases/projects/remove-member-project.use-case';
import { ListProjectsMembersUseCase } from '@/application/use-cases/projects/list-projects-member.use-case';
import { ListProjectsTasksUseCase } from '@/application/use-cases/projects/list-projects-tasks.use-case';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  let createProjectUseCase: CreateProjectUseCase;
  let listProjectsMembersUseCase: ListProjectsMembersUseCase;
  let listProjectsTasksUseCase: ListProjectsTasksUseCase;

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
        {
          provide: ListProjectsMembersUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListProjectsTasksUseCase,
          useValue: { execute: jest.fn() },
        },
        PrismaService,
        ProjectRepository,
        AuthGuard,
        JwtService,
        AddMemberToProjectsUseCase,
        RemoveMemberToProjectsUseCase,
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    createProjectUseCase =
      module.get<CreateProjectUseCase>(CreateProjectUseCase);
    listProjectsMembersUseCase = module.get<ListProjectsMembersUseCase>(
      ListProjectsMembersUseCase,
    );
    listProjectsTasksUseCase = module.get<ListProjectsTasksUseCase>(
      ListProjectsTasksUseCase,
    );
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

  describe('List Project Members', () => {
    it('should list all members of a project', async () => {
      const mockMembers = [
        {
          id: '1',
          name: 'Member 1',
          email: 'member1@example.com',
          role: 'USER' as const,
          createdAt: new Date('2021-09-01T00:00:00.000Z'),
        },

        {
          id: '2',
          name: 'Member 2',
          email: 'member2@example.com',
          role: 'USER' as const,
          createdAt: new Date('2021-09-01T00:00:00.000Z'),
        },
      ];

      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(listProjectsMembersUseCase, 'execute')
        .mockResolvedValue(mockMembers);

      const result = await projectsController.listProjectMembers(req, '1');

      expect(result).toEqual(mockMembers);
      expect(listProjectsMembersUseCase.execute).toHaveBeenCalledWith(
        '1',
        mockUser.id,
        mockUser.role,
      );
    });

    it('should throw an error if listing members fails', async () => {
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(listProjectsMembersUseCase, 'execute')
        .mockRejectedValue(new Error('Listing failed'));

      await expect(
        projectsController.listProjectMembers(req, '1'),
      ).rejects.toThrow('Listing failed');
      expect(listProjectsMembersUseCase.execute).toHaveBeenCalledWith(
        '1',
        mockUser.id,
        mockUser.role,
      );
    });
  });

  describe('List Project Tasks', () => {
    it('should list all tasks of a project', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          projectId: 'project1',
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          projectId: 'project1',
        },
      ];
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(listProjectsTasksUseCase, 'execute')
        .mockResolvedValue(mockTasks);

      const result = await projectsController.listProjectTasks(req, '1');

      expect(result).toEqual(mockTasks);
      expect(listProjectsTasksUseCase.execute).toHaveBeenCalledWith(
        '1',
        mockUser.id,
        mockUser.role,
      );
    });

    it('should throw an error if listing tasks fails', async () => {
      const mockUser = { id: 'user1', role: 'admin' };
      const req = { user: mockUser } as AuthRequest;
      jest
        .spyOn(listProjectsTasksUseCase, 'execute')
        .mockRejectedValue(new Error('Listing failed'));

      await expect(
        projectsController.listProjectTasks(req, '1'),
      ).rejects.toThrow('Listing failed');
      expect(listProjectsTasksUseCase.execute).toHaveBeenCalledWith(
        '1',
        mockUser.id,
        mockUser.role,
      );
    });
  });
});
