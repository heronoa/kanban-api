import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';

@Injectable()
export class ListProjectsMembersUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<UserResponse[]> {
    const isUserProjectMember =
      await this.projectRepository.isUserProjectMember(id, userId);

    const isUserProjectOwner = await this.projectRepository.isUserProjectOwner(
      id,
      userId,
    );

    if (userRole === 'USER' && !(isUserProjectMember || isUserProjectOwner)) {
      throw new Error('Insufficient permission');
    }

    const members = await this.projectRepository.listMembers(id);

    return members;
  }
}
