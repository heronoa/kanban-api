import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Project } from '@prisma/client';
import { Project as ProjectDTO } from '../dto/project.dto';

export interface ProjectRepositoryType {
  create(user: ProjectDTO): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  update(id: string, Project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<Project>;
}

@Injectable()
export class ProjectRepository implements ProjectRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProjectDTO): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
