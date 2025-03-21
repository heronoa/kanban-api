import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';

import { Task } from '@prisma/client';
import { Task as TaskDTO } from '../dto/task.dto';

interface TaskRepositoryType {
  create(data: TaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAllByProjectId(projectId: string): Promise<Task[]>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<Task>;
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
}
