import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Project } from '@/domain/dto/project/project.dto';

@Injectable()
export class AddMemberToProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({
    id,
    userId,
    userRole,
    memberId,
  }: {
    id: string;
    userId: string;
    userRole: string;
    memberId: string;
  }): Promise<Project> {
    const isProjectOwner = await this.projectRepository.isUserProjectOwner(
      id,
      userId,
    );
    const isUserProjectMember =
      await this.projectRepository.isUserProjectMember(id, userId);

    if (await this.projectRepository.isUserProjectOwner(id, userId)) {
      throw new ForbiddenException('User already is the project owner');
    }

    if (
      userRole === 'USER' &&
      !(await this.projectRepository.isUserProjectOwner(id, userId))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.projectRepository.addMember(id, memberId);

    return response;
  }
}
