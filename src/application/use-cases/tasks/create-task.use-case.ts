import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/dto/task/task.dto';
import { User } from '@/domain/entities/user.entity';
import { ProjectRepository } from '@/domain/repositories/project.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  private async validateUserAssignmentToProject(
    user: User,
    projectId: string,
  ): Promise<boolean> {
    if (user.role === 'USER') {
      const isMember = await this.projectRepository.isUserProjectMember(
        projectId,
        user.id,
      );
      const isOwner = await this.projectRepository.isUserProjectOwner(
        projectId,
        user.id,
      );

      if (!isMember && !isOwner) {
        throw new Error('User is not assigned to this project');
      }
    }

    return true;
  }

  async execute(taskData: Task, user: User): Promise<Task> {
    await this.validateUserAssignmentToProject(user, taskData.projectId);

    return this.taskRepository.create(taskData, user);
  }
}
