import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Project } from '@/domain/dto/project/project.dto';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({
    id,
    user,
    projectData,
  }: {
    id: string;
    user: UserResponse;
    projectData: Partial<Project>;
  }): Promise<Project> {
    if (
      user.role === 'USER' &&
      !(await this.projectRepository.isUserProjectOwner(id, user.id))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.projectRepository.update(id, projectData);

    return response;
  }
}
