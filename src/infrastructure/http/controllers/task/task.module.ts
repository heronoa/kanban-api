import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.use-case';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.use-case';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.use-case';
import { ListTasksUseCase } from '@/application/use-cases/tasks/list-tasks.use-case';
import { GetTaskByIdUseCase } from '@/application/use-cases/tasks/get-tasks-by-id.use-case';
import { MoveTaskUseCase } from '@/application/use-cases/tasks/move-task.use-case';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { TaskRepository } from '@/domain/repositories/task.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AssignTaskUseCase } from '@/application/use-cases/tasks/assign-task.use-case';
import { UnassignTaskUseCase } from '@/application/use-cases/tasks/unassign-task.use-case';
import { ListUsersOnTaskUseCase } from '@/application/use-cases/tasks/list-users-task.use-case';
import { ProjectRepository } from '@/domain/repositories/project.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret: secret,
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [TasksController],
  providers: [
    AssignTaskUseCase,
    UnassignTaskUseCase,
    ListUsersOnTaskUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
    UpdateTaskUseCase,
    ListTasksUseCase,
    GetTaskByIdUseCase,
    MoveTaskUseCase,
    AuthGuard,
    TaskRepository,
    PrismaService,
    ProjectRepository,
  ],
})
export class TaskModule {}
