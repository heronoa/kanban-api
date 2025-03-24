import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Task } from '@/domain/dto/task/task.dto';

@Injectable()
export class ListProjectsTasksUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, userId: string, userRole: string): Promise<Task[]> {
    const isUserProjectMember =
      await this.projectRepository.isUserProjectMember(id, userId);

    const isUserProjectOwner = await this.projectRepository.isUserProjectOwner(
      id,
      userId,
    );

    if (userRole === 'USER' && !(isUserProjectMember || isUserProjectOwner)) {
      throw new Error('Insufficient permission');
    }

    const tasks = await this.projectRepository.listTasks(id);

    return tasks;
  }
}
