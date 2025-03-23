import { Injectable } from '@nestjs/common';
import { ListProjectDTO } from '@/domain/dto/project/list-project.dto';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { User } from '@/domain/entities/user.entity'; // Ensure User entity is imported

@Injectable()
export class ListProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({
    page = 1,
    perPage = 10,
    user,
  }: {
    page?: number;
    perPage?: number;
    user: User;
  }): Promise<ListProjectDTO> {
    const { projects, totalCount } =
      await this.projectRepository.findAllPaginated({
        page,
        perPage: perPage,
        userId: user && user.role === 'USER' ? user.id : undefined,
      });

    const totalPages = Math.ceil(totalCount / perPage);

    return { projects, totalCount, page, perPage, totalPages };
  }
}
