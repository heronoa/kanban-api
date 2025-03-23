import { TaskRepository } from '@/domain/repositories/task.repository';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { Task } from '@/domain/entities/task.entity';
import { Project } from '@/domain/dto/project/project.dto';

export class MoveTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    taskId,
    fromProjectId,
    toProjectId,
    userId,
    userRole,
  }: {
    taskId: string;
    fromProjectId: string;
    toProjectId: string;
    userId: string;
    userRole: string;
  }): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const fromProject: Project | null =
      await this.projectRepository.findById(fromProjectId);
    if (!fromProject) {
      throw new Error('Source project not found');
    }

    const toProject: Project | null =
      await this.projectRepository.findById(toProjectId);
    if (!toProject) {
      throw new Error('Destination project not found');
    }

    const isUserAdmin = userRole === 'ADMIN';
    const isUserMemberOfFromProject =
      await this.taskRepository.isUserTaskProjectMember(fromProjectId, userId);
    const isUserMemberOfToProject =
      await this.taskRepository.isUserTaskProjectMember(fromProjectId, userId);

    if (
      !isUserAdmin &&
      (!isUserMemberOfFromProject || !isUserMemberOfToProject)
    ) {
      throw new Error('User does not have permission to move the task');
    }

    task.projectId = toProjectId;
    await this.taskRepository.update(task.id, task);

    return task;
  }
}
