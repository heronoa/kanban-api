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
    if (
      userRole === 'USER' &&
      !(await this.projectRepository.isUserProjectMember(id, userId))
    ) {
      throw new Error('Insufficient permission');
    }

    const members = await this.projectRepository.listMembers(id);

    return members;
  }
}
