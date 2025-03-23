import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Project } from '@prisma/client';
import { Project as ProjectDTO } from '@/domain/dto/project/project.dto';

export interface ProjectRepositoryType {
  findAllPaginated({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ projects: Project[]; totalCount: number }>;
  create(user: ProjectDTO): Promise<Project>;
  findByIdAndOrUserId(id: string, userId: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<ProjectDTO | null>;
  update(id: string, Project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<Project>;
  isUserProjectOwner(id: string, userId: string): Promise<boolean>;
}

@Injectable()
export class ProjectRepository implements ProjectRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProjectDTO | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findAllPaginated({
    page,
    perPage,
    userId,
  }: {
    page: number;
    perPage: number;
    userId?: string;
  }): Promise<{ projects: Project[]; totalCount: number }> {
    const [projects, totalCount] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where: userId ? { ownerId: { equals: userId } } : undefined,
      }),
      this.prisma.project.count({
        where: userId ? { ownerId: { equals: userId } } : undefined,
      }),
    ]);

    return { projects, totalCount };
  }

  async create(data: ProjectDTO): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async findByIdAndOrUserId(
    id: string,
    userId?: string,
  ): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: userId ? { id, ownerId: userId } : { id },
    });
  }

  async isUserProjectOwner(id: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    return project ? project.ownerId === userId : false;
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
