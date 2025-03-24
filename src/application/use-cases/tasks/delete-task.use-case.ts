import { TaskRepository } from '@/domain/repositories/task.repository';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';
import { Task } from '@/domain/dto/task/task.dto';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    id,
    user,
  }: {
    id: string;
    user: UserResponse;
  }): Promise<Task> {
    const task = await this.taskRepository.findAllByProjectId(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      user.role === 'USER' &&
      !(await this.taskRepository.isUserTaskMember(id, user.id))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.delete(id);

    return response;
  }
}
