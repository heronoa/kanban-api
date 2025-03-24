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
    const isUserProjectOwner = await this.projectRepository.isUserProjectOwner(
      id,
      userId,
    );

    const isMemberProjectMember =
      await this.projectRepository.isUserProjectMember(id, memberId);

    const isMemberProjectOwner =
      await this.projectRepository.isUserProjectOwner(id, memberId);

    if (isMemberProjectOwner) {
      throw new ForbiddenException('User already is the project owner');
    }

    if (isMemberProjectMember) {
      throw new ForbiddenException('User already is a project member');
    }

    if (userRole === 'USER' && !isUserProjectOwner) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.projectRepository.addMember(id, memberId);

    return response;
  }
}
