import { TaskRepository } from '@/domain/repositories/task.repository';
import { ForbiddenException } from '@nestjs/common';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';

export class ListUsersOnTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    taskId,
    userId,
    userRole,
  }: {
    taskId: string;
    userId: string;
    userRole: string;
  }): Promise<UserResponse[]> {
    if (
      userRole === 'USER' &&
      !(await this.taskRepository.isUserTaskMember(taskId, userId))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.listUserOnTask(taskId);

    return response;
  }
}
