import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { ListTaskDTO } from '@/domain/dto/task/list-task.dto';

@Injectable()
export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    userId,
    userRole,
    page = 1,
    perPage = 10,
  }: {
    userId: string;
    userRole: string;
    page?: number;
    perPage?: number;
    query?: {
      status?: string;
      projectId?: string;
    };
  }): Promise<ListTaskDTO> {
    if (userRole === 'ADMIN') {
      const { tasks, totalCount } =
        await this.taskRepository.findAllTasksPaginated({
          page,
          perPage,
        });

      const totalPages = Math.ceil(totalCount / perPage);

      return {
        tasks,
        totalCount,
        page,
        perPage,
        totalPages,
      };
    }

    const { tasks, totalCount } =
      await this.taskRepository.findTasksByProjectMember({
        userId,
        page,
        perPage,
      });

    const totalPages = Math.ceil(totalCount / perPage);

    return {
      tasks,
      totalCount,
      page,
      perPage,
      totalPages,
    };
  }
}
