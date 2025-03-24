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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/domain/dto/user/user.dto';
import { Task } from '@/domain/dto/task/task.dto';

@ApiTags('Project Management')
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
  @ApiOperation({
    summary:
      'List Projects - List all projects (Limitations: Admin may list all projects, User can only list projects that he is part of)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of projects',
    type: ListProjectsUseCase,
    example: {
      value: {
        totalPages: 1,
        page: 1,
        perPage: 10,
        totalCount: 1,
        projects: [
          {
            id: '1',
            name: 'Project 1',
            description: 'Description of project 1',
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
  @ApiOperation({ summary: 'Get Project by ID' })
  @ApiResponse({ status: 200, description: 'Project details', type: Project })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getProjectById(@Request() req: AuthRequest, @Param('id') id: string) {
    const user = req.user;

    return this.getProjectByIdUseCase.execute(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Project' })
  @ApiResponse({ status: 201, description: 'Project created', type: Project })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProject(
    @Request() req: AuthRequest,
    @Body() projectData: Project,
  ) {
    const user = req.user;

    return this.createProjectUseCase.execute(projectData, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Project' })
  @ApiResponse({ status: 200, description: 'Project updated', type: Project })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateProject(
    @Request() req: AuthRequest,
    @Body() projectData: Partial<Project>,
    @Param('id') id: string,
  ) {
    const user = req.user;

    return this.updateProjectUseCase.execute({ id, projectData, user });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Project' })
  @ApiResponse({ status: 200, description: 'Project deleted', type: Project })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteProject(@Request() req: AuthRequest, @Query('id') id: string) {
    const user = req.user;

    return this.deleteProjectUseCase.execute({ id, user });
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add Member to Project' })
  @ApiResponse({
    status: 200,
    description: 'Member added to project',
    type: Project,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async addMemberToProject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    const user = req.user;

    return this.addMemberToProjectUseCase.execute({
      id,
      userId: user.id,
      userRole: user.role,
      memberId: userId,
    });
  }

  @Delete(':id/members')
  @ApiOperation({ summary: 'Remove Member from Project' })
  @ApiResponse({
    status: 200,
    description: 'Member removed from project',
    type: Project,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiOperation({ summary: 'List Project Members' })
  @ApiResponse({
    status: 200,
    description: 'List of project members',
    type: Array<User>,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listProjectMembers(
    @Request() req: AuthRequest,
    @Param('id') id: string,
  ) {
    const userRole = req.user.role;

    return this.listProjectMembersUseCase.execute(id, req.user.id, userRole);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'List Project Tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of project tasks',
    type: Array<Task>,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listProjectTasks(@Request() req: AuthRequest, @Param('id') id: string) {
    const userRole = req.user.role;

    return this.listProjectTasksUseCase.execute(id, req.user.id, userRole);
  }
}
