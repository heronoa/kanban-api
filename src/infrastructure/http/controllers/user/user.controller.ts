import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { RolesGuard } from '@/infrastructure/http/middlewares/RoleGuard/role.guard';
import { Roles } from '@/infrastructure/http/decorators/role.decorator';
import { AuthRequest } from '@/shared/types/auth-request';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case';
import { User } from '@/domain/entities/user.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListUserDTO } from '@/domain/dto/user/list-user.dto';

@ApiTags('User Management')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private listUserUseCase: ListUserUseCase,
    private profileUserUseCase: ProfileUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get Profile - Get the user profile (Auth Guarded)',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: User,
  })
  async getProfile(@Request() req: AuthRequest) {
    return this.profileUserUseCase.execute(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List Users - List all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: ListUserDTO,
    example: {
      value: {
        users: [
          {
            id: '1',
            name: 'Test User',
            email: 'test@gmail.com',
            role: 'USER',
            createdAt: '2021-09-01T20:00:00.000Z',
          },
        ],
        page: 1,
        perPage: 10,
        total: 1,
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async listUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.listUserUseCase.execute({
      page: Number(page),
      perPage: Number(limit),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User By Id - Get user by id (Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'User',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getUserById(@Param('id') id: string) {
    return this.profileUserUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Update User - Update user data (Limitations: User can only update his own data, Admin can update any data',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() data: Partial<User>,
  ) {
    return this.updateUserUseCase.execute({ id, user: req.user, data });
  }

  @ApiOperation({
    summary:
      'Delete User - Delete user (Limitations: User can only delete his own data, Admin can delete any data',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.deleteUserUseCase.execute({ id, user: req.user });
  }
}
