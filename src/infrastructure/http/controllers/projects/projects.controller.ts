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
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects.use-case';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { AuthRequest } from '@/shared/types/auth-request';
import { GetProjectByIdUseCase } from '@/application/use-cases/projects/get-projects-by-id.use-case';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project.use-case';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project.use-case';
import { Project } from '@/domain/dto/project/project.dto';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project.use-case';
import { AddMemberToProjectsUseCase } from '@/application/use-cases/projects/add-member-project.use-case';
import { RemoveMemberToProjectsUseCase } from '@/application/use-cases/projects/remove-member-project.use-case';
import { ListProjectsMembersUseCase } from '@/application/use-cases/projects/list-projects-member.use-case';
import { ListProjectsTasksUseCase } from '@/application/use-cases/projects/list-projects-tasks.use-case';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    private listProjectsUseCase: ListProjectsUseCase,
    private getProjectByIdUseCase: GetProjectByIdUseCase,
    private createProjectUseCase: CreateProjectUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private addMemberToProjectUseCase: AddMemberToProjectsUseCase,
    private removeMemberFromProjectUseCase: RemoveMemberToProjectsUseCase,
    private listProjectMembersUseCase: ListProjectsMembersUseCase,
    private listProjectTasksUseCase: ListProjectsTasksUseCase,
  ) {}

  @Get()
  async listProjects(
    @Request() req: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const user = req.user;

    return this.listProjectsUseCase.execute({
      page: Number(page),
      perPage: Number(limit),
      user,
    });
  }

  @Get(':id')
  async getProjectById(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.getProjectByIdUseCase.execute(id, user.id);
  }

  @Post()
  async createProject(
    @Request() req: AuthRequest,
    @Body() projectData: Project,
  ) {
    const user = req.user;

    return this.createProjectUseCase.execute(projectData, user);
  }

  @Put(':id')
  async updateProject(
    @Request() req: AuthRequest,
    @Body() projectData: Partial<Project>,
    @Param() id: string,
  ) {
    const user = req.user;

    return this.updateProjectUseCase.execute({ id, projectData, user });
  }

  @Delete(':id')
  async deleteProject(@Request() req: AuthRequest, @Query('id') id: string) {
    const user = req.user;

    return this.deleteProjectUseCase.execute({ id, user });
  }

  @Post(':id/members')
  async addMemberToProject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    const user = req.user;

    return this.addMemberToProjectUseCase.execute({
      id,
      userId,
      userRole: user.role,
      memberId: userId,
    });
  }

  @Delete(':id/members')
  async removeMemberFromProject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    const user = req.user;

    return this.removeMemberFromProjectUseCase.execute({
      id,
      userId,
      userRole: user.role,
      memberId: userId,
    });
  }

  @Get(':id/members')
  async listProjectMembers(
    @Request() req: AuthRequest,
    @Param('id') id: string,
  ) {
    const userRole = req.user.role;

    return this.listProjectMembersUseCase.execute(id, req.user.id, userRole);
  }

  @Get(':id/tasks')
  async listProjectTasks(@Request() req: AuthRequest, @Param('id') id: string) {
    const userRole = req.user.role;

    return this.listProjectTasksUseCase.execute(id, req.user.id, userRole);
  }
}
