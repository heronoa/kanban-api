/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '@/infrastructure/http/controllers/projects/projects.controller';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { AuthRequest } from '@/shared/types/auth-request';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AddMemberToProjectsUseCase } from '@/application/use-cases/projects/add-member-project.use-case';
import { ListProjectsMembersUseCase } from '@/application/use-cases/projects/list-projects-member.use-case';
import { ListProjectsTasksUseCase } from '@/application/use-cases/projects/list-projects-tasks.use-case';
import { RemoveMemberToProjectsUseCase } from '@/application/use-cases/projects/remove-member-project.use-case';

describe('ProjectsController - Delete Project', () => {
  let projectsController: ProjectsController;
  let deleteProjectUseCase: DeleteProjectUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: DeleteProjectUseCase,
          useValue: { execute: jest.fn() },
        },
        PrismaService,
        ProjectRepository,
        AuthGuard,
        ListProjectsUseCase,
        CreateProjectUseCase,
        UpdateProjectUseCase,
        GetProjectByIdUseCase,
        AddMemberToProjectsUseCase,
        RemoveMemberToProjectsUseCase,
        ListProjectsMembersUseCase,
        ListProjectsTasksUseCase,
        JwtService,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    deleteProjectUseCase =
      module.get<DeleteProjectUseCase>(DeleteProjectUseCase);
  });

  it('should delete a project successfully', async () => {
    jest.spyOn(deleteProjectUseCase, 'execute').mockResolvedValue({
      name: 'Test Project',
      ownerId: 'owner1',
      description: 'Test Description',
    });

    const req = { user: { id: 'user1' } } as AuthRequest;
    const result = await projectsController.deleteProject(req, '1');

    expect(result).toEqual({
      name: 'Test Project',
      ownerId: 'owner1',
      description: 'Test Description',
    });
    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: req.user,
    });
  });

  it('should handle errors when deleting a project', async () => {
    const error = new Error('Project not found');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    const req = { user: { id: 'user1' } } as AuthRequest;
    try {
      await projectsController.deleteProject(req, '1');
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: req.user,
    });
  });

  it('should return a 404 error if project does not exist', async () => {
    const error = new Error('Project not found');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    const req = { user: { id: 'user1' } } as AuthRequest;
    try {
      await projectsController.deleteProject(req, '999');
    } catch (e) {
      expect(e.message).toBe('Project not found');
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith({
      id: '999',
      user: req.user,
    });
  });

  it('should return a 500 error for unexpected errors', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(deleteProjectUseCase, 'execute').mockRejectedValue(error);

    const req = { user: { id: 'user1' } } as AuthRequest;
    try {
      await projectsController.deleteProject(req, '1');
    } catch (e) {
      expect(e.message).toBe('Unexpected error');
    }

    expect(deleteProjectUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: req.user,
    });
  });
});
