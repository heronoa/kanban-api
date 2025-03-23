import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '../../middlewares/AuthGuard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { ProjectRepository } from '@/domain/repositories/project.repository';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';

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
  providers: [
    PrismaService,
    ProjectRepository,
    AuthGuard,
    ListProjectsUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectByIdUseCase,
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
