import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/entities/task.entity';
import { ForbiddenException } from '@nestjs/common';

export class AssignTaskUseCase {
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
    const isTaskOwner = await this.taskRepository.isUserTaskOwner(
      taskId,
      userId,
    );
    const isUserTaskMember = await this.taskRepository.isUserTaskMember(
      taskId,
      userId,
    );

    if (userRole === 'USER' && !(isUserTaskMember && isTaskOwner)) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.addUserToTask(taskId, userId);

    return response;
  }
}
