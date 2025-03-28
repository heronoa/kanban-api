/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ListProjectDTO } from '@/domain/dto/project/list-project.dto';
import { Task } from '@/domain/dto/task/task.dto';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';
import { ListTaskDTO } from '@/domain/dto/task/list-task.dto';

describe('Kanban API - Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let projectId: string;
  let taskId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
    await prisma.$executeRaw`TRUNCATE "User", "Project", "Task" RESTART IDENTITY CASCADE;`;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      expect(res.status).toBe(201);
      userId = (res.body as AuthResponseDto).user.id;
    });

    it('should authenticate the user and return a token', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(201);
      token = res.body.token;
      expect(token).toBeDefined();
    });
  });

  describe('Project Management', () => {
    it('should create a new project', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Projeto Teste' });
      expect(res.status).toBe(201);
      projectId = res.body.id;
    });

    it('should list projects', async () => {
      const res = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);

      const body: ListProjectDTO = res.body;
      expect(body.projects).toBeDefined();
      expect(body.totalCount).toBeDefined();

      expect(body.projects.length).toBeGreaterThan(0);
      expect(body.totalCount).toBeGreaterThan(0);
    });

    it('should assign user to project', async () => {
      const res = await request(app.getHttpServer())
        .post(`/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId });
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('User already is the project owner');
    });
  });

  describe('Task Management', () => {
    it('should create a new task', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tarefa Teste',
          projectId,
        } as Task);
      expect(res.status).toBe(201);
      taskId = res.body.id;
    });

    it('should list tasks', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect((res.body as ListTaskDTO).tasks.length).toBeGreaterThan(0);
    });

    it('should update a task', async () => {
      const res = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Tarefa Atualizada' });
      expect(res.status).toBe(200);
    });

    it('should delete a task', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
