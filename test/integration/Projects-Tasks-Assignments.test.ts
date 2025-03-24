/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const request = require('supertest');

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';

describe('Kanban API - Testes de Integração', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let token2: string;
  let projectId: string;
  let taskId: string;
  let userId1: string;
  let userId2: string;

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

  it('Deve registrar usuários', async () => {
    const res1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
      });
    expect(res1.status).toBe(201);
    userId1 = (res1.body as AuthResponseDto).user.id;

    const res2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user2@example.com',
        password: 'password123',
        name: 'User 2',
      });
    expect(res2.status).toBe(201);
    userId2 = (res2.body as AuthResponseDto).user.id;
    token2 = (res2.body as AuthResponseDto).token;
  });

  it('Deve autenticar um usuário e retornar um token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user1@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    token = (res.body as AuthResponseDto).token;
  });

  it('Deve criar um projeto', async () => {
    const res = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Projeto Teste' });
    expect(res.status).toBe(201);
    projectId = res.body.id;
  });

  it('Deve adicionar usuários ao projeto', async () => {
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

  it('Deve criar uma tarefa', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token2}`)
      .send({ title: 'Tarefa Teste', projectId });

    expect(res.status).toBe(201);
    taskId = res.body.id;
  });

  it('should list members of a project', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should list tasks of a project', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token2}`);

    console.log('list of tasks', res.body);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should list members of a task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}/users`)
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('Deve atribuir usuários à tarefa', async () => {
    const res = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId1 });

    console.log(res.body);

    const res2 = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(201);

    console.log(res2);
  });

  it('Deve remover usuários da tarefa', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/unassign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });

  it('Deve remover usuários do projeto', async () => {
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });
});
