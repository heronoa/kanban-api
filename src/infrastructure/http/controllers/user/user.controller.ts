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
  async getProfile(@Request() req: AuthRequest) {
    console.log('user', req.user);

    return this.profileUserUseCase.execute(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async listUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.listUserUseCase.execute({
      page: Number(page),
      perPage: Number(limit),
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getUserById(@Param('id') id: string) {
    return this.profileUserUseCase.execute(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() data: Partial<User>,
  ) {
    return this.updateUserUseCase.execute({ id, user: req.user, data });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.deleteUserUseCase.execute({ id, user: req.user });
  }
}
