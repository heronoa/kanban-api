import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { UserRepository } from '@/domain/repositories/user.repository';

describe('Task Repository - CRUD', () => {
  let taskRepository: TaskRepository;
  let prisma: PrismaService;
  let testTask: Task;
  let testProjectId: string;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRepository, PrismaService, UserRepository],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    prisma = module.get<PrismaService>(PrismaService);

    const createdUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword123',
        role: 'USER',
      },
    });
    testUserId = createdUser.id;

    const createdProject = await prisma.project.create({
      data: {
        name: 'Test Project',
        ownerId: testUserId,
      },
    });
    testProjectId = createdProject.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a task', async () => {
    testTask = await taskRepository.create({
      title: 'Test Task',
      description: 'This is a test task',
      projectId: testProjectId,
    });

    expect(testTask).toBeDefined();
    expect(testTask.id).toBeDefined();
    expect(testTask.title).toBe('Test Task');
  });

  it('should retrieve a task by ID', async () => {
    const task = await taskRepository.findById(testTask.id);

    expect(task).toBeDefined();
    expect(task?.id).toBe(testTask.id);
  });

  it('should retrieve all tasks by project ID', async () => {
    const tasks = await taskRepository.findAllByProjectId(testProjectId);

    expect(tasks).toBeDefined();
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('should update a task', async () => {
    const updatedTask = await taskRepository.update(testTask.id, {
      title: 'Updated Task',
    });

    expect(updatedTask.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    await taskRepository.delete(testTask.id);

    const deletedTask = await taskRepository.findById(testTask.id);

    expect(deletedTask).toBeNull();
  });
});
