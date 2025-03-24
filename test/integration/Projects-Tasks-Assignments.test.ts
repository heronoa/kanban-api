/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const request = require('supertest');

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infrastructure/database/prisma.service';

describe('Kanban API - Testes de Integração', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
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
      .post('/api/v1/auth/register')
      .send({
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
      });
    expect(res1.status).toBe(201);
    userId1 = res1.body.id;

    const res2 = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'user2@example.com',
        password: 'password123',
        name: 'User 2',
      });
    expect(res2.status).toBe(201);
    userId2 = res2.body.id;
  });

  it('Deve autenticar um usuário e retornar um token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user1@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    token = res.body.access_token;
  });

  it('Deve criar um projeto', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Projeto Teste' });
    expect(res.status).toBe(201);
    projectId = res.body.id;
  });

  it('Deve adicionar usuários ao projeto', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId1 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(201);
  });

  it('Deve criar uma tarefa', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarefa Teste', projectId });
    expect(res.status).toBe(201);
    taskId = res.body.id;
  });

  it('Deve atribuir usuários à tarefa', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId1 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(201);
  });

  it('Deve remover usuários da tarefa', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/tasks/${taskId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId1 })
      .expect(200);
  });

  it('Deve remover usuários do projeto', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userId2 })
      .expect(200);
  });
});
