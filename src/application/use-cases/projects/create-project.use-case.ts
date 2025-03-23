import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Project } from '@/domain/dto/project/project.dto';
import { User } from '@/domain/entities/user.entity';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectData: Project, user: User): Promise<Project> {
    if (user.role === 'USER') {
      projectData.ownerId = user.id;
    }

    const project = await this.projectRepository.create(projectData);

    return project;
  }
}
