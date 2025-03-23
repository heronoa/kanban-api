import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { AuthRequest } from '@/shared/types/auth-request';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { Task } from '@/domain/dto/task/task.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private listTasksUseCase: ListTasksUseCase,
    private getTaskByIdUseCase: GetTaskByIdUseCase,
    private moveTaskUseCase: MoveTaskUseCase,
  ) {}

  @Get()
  async listTasks(
    @Request() req: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const user = req.user;

    return this.listTasksUseCase.execute({
      userId: user.id,
      userRole: user.role,
      page: Number(page),
      perPage: Number(limit),
    });
  }

  @Get(':id')
  async getTaskById(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.getTaskByIdUseCase.execute({
      id,
      userId: user.id,
      userRole: user.role,
    });
  }

  @Post()
  async createTask(@Request() req: AuthRequest, @Body() taskData: Task) {
    const user = req.user;

    return this.createTaskUseCase.execute(taskData, user);
  }

  @Put(':id')
  async updateTask(
    @Request() req: AuthRequest,
    @Body() taskData: Partial<Task>,
    @Param('id') id: string,
  ) {
    const user = req.user;

    return this.updateTaskUseCase.execute({ id, user, taskData });
  }

  @Delete(':id')
  async deleteTask(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.deleteTaskUseCase.execute({ id, user });
  }

  @Post(':id/move')
  async moveTask(
    @Request() req: AuthRequest,
    @Param('id') taskId: string,
    @Body()
    {
      fromProjectId,
      toProjectId,
    }: { fromProjectId: string; toProjectId: string },
  ) {
    const user = req.user;

    return this.moveTaskUseCase.execute({
      taskId,
      fromProjectId,
      toProjectId,
      userId: user.id,
      userRole: user.role,
    });
  }
}
