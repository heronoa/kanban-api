import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '@/infrastructure/http/controllers/project.controller';
import { UpdateProjectUseCase } from '@/application/use-cases/update-project.use-case';

describe('ProjectController - Update Project', () => {
  let projectController: ProjectController;
  let updateProjectUseCase: UpdateProjectUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: UpdateProjectUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    updateProjectUseCase = module.get<UpdateProjectUseCase>(UpdateProjectUseCase);
  });

  describe('Update Project', () => {
    it('should update a project', async () => {
      const mockProject = { id: '1', name: 'Project 1' };
      jest.spyOn(updateProjectUseCase, 'execute').mockResolvedValue(mockProject);

      const result = await projectController.update('1', {
        name: 'Updated Project',
      });

      expect(result).toEqual(mockProject);
      expect(updateProjectUseCase.execute).toHaveBeenCalledWith('1', {
        name: 'Updated Project',
      });
    });

    it('should throw an error if project not found', async () => {
      jest.spyOn(updateProjectUseCase, 'execute').mockRejectedValue(new Error('Project not found'));

      await expect(
        projectController.update('1', { name: 'Updated Project' })
      ).rejects.toThrow('Project not found');
    });

    it('should validate input data', async () => {
      const invalidData = { name: '' };
      jest.spyOn(updateProjectUseCase, 'execute').mockImplementation(() => {
        throw new Error('Invalid data');
      });

      await expect(
        projectController.update('1', invalidData)
      ).rejects.toThrow('Invalid data');
    });
  });
});
