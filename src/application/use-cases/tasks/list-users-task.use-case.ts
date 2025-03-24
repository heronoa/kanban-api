import { TaskRepository } from '@/domain/repositories/task.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';
@Injectable()
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
    const isUserTaskMember = await this.taskRepository.isUserTaskMember(
      taskId,
      userId,
    );

    const isUserTaskOwner = await this.taskRepository.isUserTaskProjectOwner(
      taskId,
      userId,
    );

    if (userRole === 'USER' && !(isUserTaskMember || isUserTaskOwner)) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.listUserOnTask(taskId);

    return response;
  }
}
