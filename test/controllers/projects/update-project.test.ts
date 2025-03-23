/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '@/infrastructure/http/controllers/projects/projects.controller';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RemoveMemberToProjectsUseCase } from '@/application/use-cases/projects/remove-member-project.use-case';
import { AddMemberToProjectsUseCase } from '@/application/use-cases/projects/add-member-project.use-case';
import { ListProjectsMembersUseCase } from '@/application/use-cases/projects/list-projects-member.use-case';
import { ListProjectsTasksUseCase } from '@/application/use-cases/projects/list-projects-tasks.use-case';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  let updateProjectUseCase: UpdateProjectUseCase;
  let addMemberToProjectsUseCase: AddMemberToProjectsUseCase;
  let removeMemberToProjectsUseCase: RemoveMemberToProjectsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: UpdateProjectUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AddMemberToProjectsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RemoveMemberToProjectsUseCase,
          useValue: { execute: jest.fn() },
        },
        CreateProjectUseCase,
        DeleteProjectUseCase,
        ListProjectsUseCase,
        GetProjectByIdUseCase,
        AuthGuard,
        ProjectRepository,
        PrismaService,
        ListProjectsMembersUseCase,
        ListProjectsTasksUseCase,
        JwtService,
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    updateProjectUseCase =
      module.get<UpdateProjectUseCase>(UpdateProjectUseCase);
    addMemberToProjectsUseCase = module.get<AddMemberToProjectsUseCase>(
      AddMemberToProjectsUseCase,
    );
    removeMemberToProjectsUseCase = module.get<RemoveMemberToProjectsUseCase>(
      RemoveMemberToProjectsUseCase,
    );
  });

  describe('Update Project', () => {
    it('should update a project', async () => {
      const mockProject = {
        id: '1',
        name: 'Project 1',
        ownerId: '1',
        description: 'Project description',
      };
      jest
        .spyOn(updateProjectUseCase, 'execute')
        .mockResolvedValue(mockProject);

      const req = { user: { id: 'user1' } } as AuthRequest;
      const result = await projectsController.updateProject(
        req,
        { name: 'Updated Project' },
        '1',
      );

      expect(result).toEqual(mockProject);
      expect(updateProjectUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        projectData: { name: 'Updated Project' },
        user: req.user,
      });
    });

    it('should throw an error if project not found', async () => {
      jest
        .spyOn(updateProjectUseCase, 'execute')
        .mockRejectedValue(new Error('Project not found'));

      const req = { user: { id: 'user1' } } as AuthRequest;
      await expect(
        projectsController.updateProject(req, { name: 'Updated Project' }, '1'),
      ).rejects.toThrow('Project not found');
    });

    it('should validate input data', async () => {
      const invalidData = { name: '' };
      jest.spyOn(updateProjectUseCase, 'execute').mockImplementation(() => {
        throw new Error('Invalid data');
      });

      const req = { user: { id: 'user1' } } as AuthRequest;
      await expect(
        projectsController.updateProject(req, invalidData, '1'),
      ).rejects.toThrow('Invalid data');
    });
  });

  describe('Add Member to Project', () => {
    it('should add a member to a project', async () => {
      const mockProject = {
        id: '1',
        name: 'Project 1',
        ownerId: '1',
        description: 'Project description',
      };
      jest
        .spyOn(addMemberToProjectsUseCase, 'execute')
        .mockResolvedValue(mockProject);

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;
      const result = await projectsController.addMemberToProject(
        req,
        '1',
        'user2',
      );

      expect(result).toEqual(mockProject);
      expect(addMemberToProjectsUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        userId: 'user2',
        userRole: 'ADMIN',
        memberId: 'user2',
      });
    });

    it('should throw an error if member cannot be added', async () => {
      jest
        .spyOn(addMemberToProjectsUseCase, 'execute')
        .mockRejectedValue(new Error('Cannot add member'));

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;
      await expect(
        projectsController.addMemberToProject(req, '1', 'user2'),
      ).rejects.toThrow('Cannot add member');
    });
  });

  describe('Remove Member from Project', () => {
    it('should remove a member from a project', async () => {
      const mockProject = {
        id: '1',
        name: 'Project 1',
        ownerId: '1',
        description: 'Project description',
      };
      jest
        .spyOn(removeMemberToProjectsUseCase, 'execute')
        .mockResolvedValue(mockProject);

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;
      const result = await projectsController.removeMemberFromProject(
        req,
        '1',
        'user2',
      );

      expect(result).toEqual(mockProject);
      expect(removeMemberToProjectsUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        userId: 'user2',
        userRole: 'ADMIN',
        memberId: 'user2',
      });
    });

    it('should throw an error if member cannot be removed', async () => {
      jest
        .spyOn(removeMemberToProjectsUseCase, 'execute')
        .mockRejectedValue(new Error('Cannot remove member'));

      const req = { user: { id: 'user1', role: 'ADMIN' } } as AuthRequest;
      await expect(
        projectsController.removeMemberFromProject(req, '1', 'user2'),
      ).rejects.toThrow('Cannot remove member');
    });
  });
});
