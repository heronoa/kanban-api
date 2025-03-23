import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';

import { Task } from '@prisma/client';
import { Task as TaskDTO } from '../dto/task/task.dto';

interface TaskRepositoryType {
  create(data: TaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAllByProjectId(projectId: string): Promise<Task[]>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<Task>;
  isUserTaskMember(taskId: string, userId: string): Promise<boolean>;
  isUserTaskProjectMember(taskId: string, userId: string): Promise<boolean>;
  isUserTaskOwner(taskId: string, userId: string): Promise<boolean>;
  findTasksByProjectMember({
    userId,
    page,
    perPage,
  }: {
    userId: string;
    page?: number;
    perPage?: number;
  }): Promise<{ tasks: Task[]; totalCount: number }>;
  findAllTasksPaginated({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ tasks: Task[]; totalCount: number }>;
  findTasksByIdAndUserId(taskId: string, userId: string): Promise<Task | null>;
}

@Injectable()
export class TaskRepository implements TaskRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TaskDTO): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { users: true },
    });
  }

  async findAllTasksPaginated({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ tasks: Task[]; totalCount: number }> {
    const tasks = await this.prisma.task.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalCount = await this.prisma.task.count();

    return { tasks, totalCount };
  }

  async findTasksByProjectMember({
    userId,
    page = 1,
    perPage = 10,
  }: {
    userId: string;
    page?: number;
    perPage?: number;
  }): Promise<{ tasks: Task[]; totalCount: number }> {
    const tasks = await this.prisma.task.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        project: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    const totalCount = await this.prisma.task.count({
      where: {
        project: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    return { tasks, totalCount };
  }

  async findTasksByIdAndUserId(
    taskId: string,
    userId: string,
  ): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });
  }

  async findAllByProjectId(projectId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async isUserTaskMember(taskId: string, userId: string): Promise<boolean> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: { id: true },
    });

    return !!task;
  }

  async isUserTaskProjectMember(
    taskId: string,
    userId: string,
  ): Promise<boolean> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      select: { id: true },
    });

    return !!task;
  }

  async isUserTaskOwner(taskId: string, userId: string): Promise<boolean> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { user: true },
    });

    return task?.user?.id === userId;
  }
}
