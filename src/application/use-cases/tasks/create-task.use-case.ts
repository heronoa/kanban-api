import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/dto/task/task.dto';
import { User } from '@/domain/entities/user.entity';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  private validateUserAssignmentToProject(
    user: User,
    projectId: string,
  ): boolean {
    if (user.role === 'USER') {
      if (!user.projects.map((project) => project.id).includes(projectId)) {
        throw new Error('User is not assigned to this project');
      }
    }

    return true;
  }

  async execute(taskData: Task, user: User): Promise<Task> {
    this.validateUserAssignmentToProject(user, taskData.projectId);
    return this.taskRepository.create(taskData);
  }
}
