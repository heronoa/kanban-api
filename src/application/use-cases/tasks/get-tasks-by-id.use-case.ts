import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { Task } from '@/domain/dto/task/task.dto';

// If user is USER, return task only if user is part of the project
// If user is ADMIN, return all tasks

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    id,
    userId,
    userRole,
  }: {
    id: string;
    userId: string;
    userRole: string;
  }): Promise<Task> {
    if (userRole === 'USER') {
      const task = await this.taskRepository.findTasksByIdAndUserId(id, userId);

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } else {
      const task = await this.taskRepository.findById(id);

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    }
  }
}
