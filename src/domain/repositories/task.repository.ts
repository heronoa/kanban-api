import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';

import { Task } from '@prisma/client';
import { Task as TaskDTO } from '../dto/task/task.dto';
import { UserResponse } from '../dto/auth/auth-reponse.dto';
import { User } from '../entities/user.entity';

interface TaskRepositoryType {
  create(data: TaskDTO, user: User): Promise<Task>;
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
  addUserToTask(taskId: string, userId: string): Promise<Task>;
  removeUserFromTask(taskId: string, userId: string): Promise<Task>;
  listUsersTask(userId: string): Promise<Task[]>;
}

@Injectable()
export class TaskRepository implements TaskRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(data: TaskDTO, user: User): Promise<Task> {
    const taskData: TaskDTO & { users?: any; project?: any } = {
      ...data,
    };

    if (user.role === 'USER') {
      taskData.users = {
        connect: { id: user.id },
      };
      taskData.project = {
        connect: { id: data.projectId },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projectId, ...connectableData } = taskData;

    return this.prisma.task.create({
      data: {
        ...connectableData,
        assignedTo: undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        project: taskData.project ? taskData.project : undefined,
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { users: true },
    });
  }

  async addUserToTask(taskId: string, userId: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeUserFromTask(taskId: string, userId: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async listUsersTask(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async listUserOnTask(taskId: string): Promise<UserResponse[]> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            role: true,
          },
        },
      },
    });

    return task?.users || [];
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
        OR: [
          {
            project: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
          {
            project: {
              ownerId: userId,
            },
          },
        ],
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

  async moveTask(taskId: string, toProjectId: string): Promise<Task> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          users: {
            set: [],
          },
        },
      });

      return prisma.task.update({
        where: { id: taskId },
        data: {
          project: {
            connect: { id: toProjectId },
          },
        },
      });
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
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

  async isUserTaskProjectOwner(
    taskId: string,
    userId: string,
  ): Promise<boolean> {
    const project = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: userId,
        },
      },
      select: { id: true },
    });

    return !!project;
  }

  async isUserTaskOwner(taskId: string, userId: string): Promise<boolean> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { user: true },
    });

    return task?.user?.id === userId;
  }
}
