import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Project } from '@/domain/dto/project/project.dto';

@Injectable()
export class RemoveMemberToProjectsUseCase {
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
    const isUserProjectOwner = await this.projectRepository.isUserProjectOwner(
      id,
      userId,
    );

    const isMemberProjectMember =
      await this.projectRepository.isUserProjectMember(id, memberId);

    if (userRole === 'USER' && !isUserProjectOwner) {
      throw new ForbiddenException('Insufficient permission');
    }

    if (!isMemberProjectMember) {
      throw new ForbiddenException('User is not a member of the project');
    }

    const response = await this.projectRepository.removeMember(id, memberId);

    return response;
  }
}
