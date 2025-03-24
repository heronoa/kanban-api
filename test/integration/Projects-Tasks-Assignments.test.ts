/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';

const request = require('supertest');

describe('Kanban API - Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let token2: string;
  let projectId: string;
  let taskId: string;
  let userId1: string;
  let userId2: string;

  const user1 = {
    email: 'user1@example.com',
    password: 'password123',
    name: 'User 1',
  };
  const user2 = {
    email: 'user2@example.com',
    password: 'password123',
    name: 'User 2',
  };

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

  const registerUser = async (user: {
    email: string;
    password: string;
    name: string;
  }) => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user);
    expect(res.status).toBe(201);
    return res.body as AuthResponseDto;
  };

  it('should register users', async () => {
    const res1 = await registerUser(user1);
    userId1 = res1.user.id;
    token = res1.token;

    const res2 = await registerUser(user2);
    userId2 = res2.user.id;
    token2 = res2.token;
  });

  it('should authenticate a user and return a token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user1.email, password: user1.password });
    expect(res.status).toBe(201);
  });

  it('should create a project', async () => {
    const res = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project' });
    expect(res.status).toBe(201);
    projectId = res.body.id;
  });

  it('should add users to the project', async () => {
    await request(app.getHttpServer())
      .post(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(403);
  });

  it('should create a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token2}`)
      .send({ title: 'Test Task', projectId });

    expect(res.status).toBe(201);
    taskId = res.body.id;
  });

  it('should list members of a project', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should list tasks of a project', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should list members of a task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}/users`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should assign users to the task', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId1 })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });

  it('should unassign users from the task', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/unassign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });

  it('should remove users from the project', async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });

  it('should create a new project and move a task to it', async () => {
    const res = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project 2' });
    expect(res.status).toBe(201);
    const projectId2 = res.body.id;

    const res2 = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/move`)
      .set('Authorization', `Bearer ${token}`)
      .send({ fromProjectId: projectId, toProjectId: projectId2 });

    expect(res2.status).toBe(200);
  });
});
