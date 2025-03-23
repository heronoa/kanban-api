import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/dto/task/task.dto';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    id,
    user,
    taskData,
  }: {
    id: string;
    user: UserResponse;
    taskData: Partial<Task>;
  }): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      user.role === 'USER' &&
      !(await this.taskRepository.isUserTaskMember(id, user.id))
    ) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.taskRepository.update(id, taskData);

    return response;
  }
}
