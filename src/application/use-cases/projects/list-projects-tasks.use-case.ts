import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Task } from '@/domain/dto/task/task.dto';

@Injectable()
export class ListProjectsTasksUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, userId: string, userRole: string): Promise<Task[]> {
    if (
      userRole === 'USER' &&
      !(await this.projectRepository.isUserProjectMember(id, userId))
    ) {
      throw new Error('Insufficient permission');
    }

    const tasks = await this.projectRepository.listTasks(id);

    return tasks;
  }
}
