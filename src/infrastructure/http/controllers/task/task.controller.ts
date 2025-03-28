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
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListTaskDTO } from '@/domain/dto/task/list-task.dto';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';
import { AssignTaskUseCase } from '@/application/use-cases/tasks/assign-task.use-case';
import { UnassignTaskUseCase } from '@/application/use-cases/tasks/unassign-task.use-case';
import { ListUsersOnTaskUseCase } from '@/application/use-cases/tasks/list-users-task.use-case';

@ApiTags('Tasks Management')
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
    private assignTaskUseCase: AssignTaskUseCase,
    private unassignTaskUseCase: UnassignTaskUseCase,
    private listUsersOnTaskUseCase: ListUsersOnTaskUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'List Tasks - List all tasks (Limitations: Admin may list all tasks, User can only list tasks from a project that he is part of)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: ListTaskDTO,
    example: {
      value: {
        totalPages: 1,
        page: 1,
        perPage: 10,
        totalCount: 1,
        tasks: [
          {
            id: '1',
            title: 'Task 1',
            description: 'Description of task 1',
            status: 'TODO',
            createdAt: '2021-09-01T20:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listTasks(
    @Request() req: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ) {
    const user = req.user;

    return this.listTasksUseCase.execute({
      userId: user.id,
      userRole: user.role,
      page: Number(page),
      perPage: Number(limit),
      query: {
        projectId,
        status,
      },
    });
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get Task - Get a task by id (Limitations: Admin can get any task by id but a User can only get tasks owned by a project that he is part of',
  })
  @ApiResponse({
    status: 200,
    description: 'Task',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getTaskById(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.getTaskByIdUseCase.execute({
      id,
      userId: user.id,
      userRole: user.role,
    });
  }

  @Post()
  @ApiOperation({
    summary:
      'Create Task - Create a new task (Auth Guarded) Limitations: User can only create tasks in projects that he is part of, Admin can create tasks in any project',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  async createTask(@Request() req: AuthRequest, @Body() taskData: Task) {
    const user = req.user;

    return this.createTaskUseCase.execute(taskData, user);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Update Task - Update a task by id Limitations: User can only update task from projects that he is part of, Admin can update any task',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateTask(
    @Request() req: AuthRequest,
    @Body() taskData: Partial<Task>,
    @Param('id') id: string,
  ) {
    const user = req.user;

    return this.updateTaskUseCase.execute({ id, user, taskData });
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete Task - Delete a task by id Limitations: User can only delete task that he is owner, Admin can delete any task',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteTask(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.deleteTaskUseCase.execute({ id, user });
  }

  @Patch(':id/move')
  @ApiOperation({
    summary:
      'Move Task - Move a task to another project Limitations: User can only move tasks from projects that he is part of to a project that he is part of, Admin can move any task',
  })
  @ApiResponse({
    status: 200,
    description: 'Task moved',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
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

  @Patch(':id/assign')
  @ApiOperation({
    summary:
      'Assign Task - Assign a task to a user Limitations: User can only assign tasks from projects that he is part of to a user that is part of the project, Admin can assign any task to any user',
  })
  @ApiResponse({
    status: 200,
    description: 'Task assigned',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  async assignTask(
    @Request() req: AuthRequest,
    @Param('id') taskId: string,
    @Body() { userId }: { userId: string },
  ) {
    const user = req.user;

    return this.assignTaskUseCase.execute({
      taskId,
      userId,
      userRole: user.role,
    });
  }

  @Patch(':id/unassign')
  @ApiOperation({
    summary:
      'Unassign Task - Unassign a task from a user Limitations: User can only unassign tasks from projects that he is part of from a user that is part of the project, Admin can unassign any task from any user',
  })
  @ApiResponse({
    status: 200,
    description: 'Task unassigned',
    type: Task,
    example: {
      value: {
        id: '1',
        title: 'Task 1',
        description: 'Description of task 1',
        status: 'TODO',
        createdAt: '2021-09-01T20:00:00.000Z',
      },
    },
  })
  async unassignTask(
    @Request() req: AuthRequest,
    @Param('id') taskId: string,
    @Body() { userId }: { userId: string },
  ) {
    const user = req.user;

    return this.unassignTaskUseCase.execute({
      taskId,
      userId,
      userRole: user.role,
    });
  }

  @Get(':id/users')
  @ApiOperation({
    summary:
      'List Task Users - List all users assigned to a task Limitations: User can only list users from projects that he is part of, Admin can list any user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: Array<UserResponse>,
    example: {
      value: {
        totalPages: 1,
        page: 1,
        perPage: 10,
        totalCount: 1,
        users: [
          {
            id: '1',
            name: 'User 1',
            email: 'user@gmail.com',
            role: 'USER',
            createdAt: '2021-09-01T20:00:00.000Z',
          },
        ],
      },
    },
  })
  async listTaskUsers(
    @Request() req: AuthRequest,
    @Param('id') taskId: string,
  ) {
    const user = req.user;

    return this.listUsersOnTaskUseCase.execute({
      taskId,
      userId: user.id,
      userRole: user.role,
    });
  }
}
