import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { User } from '@/domain/entities/user.entity';
import { Project } from '@/domain/dto/project/project.dto';
import { Project as PrismaProject } from '@prisma/client';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectData: Project, user: User): Promise<PrismaProject> {
    if (user.role === 'USER' || !projectData?.ownerId) {
      projectData.ownerId = user.id;
    }

    const project = await this.projectRepository.create(
      projectData as {
        name: string;
        ownerId: string;
        description: string;
      },
    );

    return project;
  }
}
