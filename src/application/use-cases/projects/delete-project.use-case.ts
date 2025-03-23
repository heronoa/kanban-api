import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';
import { Project } from '@/domain/dto/project/project.dto';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({
    id,
    user,
  }: {
    id: string;
    user: UserResponse;
  }): Promise<Project> {
    const project = await this.projectRepository.findByIdAndOrUserId(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      user.role === 'USER' &&
      !(await this.projectRepository.isUserProjectOwner(id, user.id))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.projectRepository.delete(id);

    return response;
  }
}
