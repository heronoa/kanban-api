import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/entities/task.entity';
import { ForbiddenException } from '@nestjs/common';

export class UnassignTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    taskId,
    userId,
    userRole,
  }: {
    taskId: string;
    userId: string;
    userRole: string;
  }): Promise<Task> {
    if (
      userRole === 'USER' &&
      !(await this.taskRepository.isUserTaskMember(taskId, userId))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.removeUserFromTask(
      taskId,
      userId,
    );

    return response;
  }
}
