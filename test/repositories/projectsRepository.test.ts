import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { Project, User } from '@prisma/client';

describe('ProjectRepository', () => {
  let projectRepository: ProjectRepository;
  let prisma: PrismaService;
  let testProject: Project;
  let testUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRepository, PrismaService, UserRepository],
    }).compile();

    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    prisma = module.get<PrismaService>(PrismaService);

    testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword123',
        role: 'USER',
      },
    });
  });

  afterAll(async () => {
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a project', async () => {
    testProject = await projectRepository.create({
      name: 'Test Project',
      ownerId: testUser.id,
      description: 'Test Description',
    });

    expect(testProject).toBeDefined();
    expect(testProject.id).toBeDefined();
    expect(testProject.name).toBe('Test Project');
  });

  it('should retrieve a project by ID', async () => {
    const project = await projectRepository.findById(testProject.id);

    expect(project).toBeDefined();
    expect(project?.id).toBe(testProject.id);
  });

  it('should retrieve all projects', async () => {
    const projects = await projectRepository.findAll();

    expect(projects).toBeDefined();
    expect(projects.length).toBeGreaterThan(0);
  });

  it('should update a project', async () => {
    const updatedProject = await projectRepository.update(testProject.id, {
      name: 'Updated Project',
    });

    expect(updatedProject.name).toBe('Updated Project');
  });

  it('should delete a project', async () => {
    await projectRepository.delete(testProject.id);

    const deletedProject = await projectRepository.findById(testProject.id);

    expect(deletedProject).toBeNull();
  });
});
