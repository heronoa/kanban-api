import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { RolesGuard } from '@/infrastructure/http/middlewares/RoleGuard/role.guard';
import { Roles } from '@/infrastructure/http/decorators/role.decorator';
import { AuthRequest } from '@/shared/types/auth-request';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private listUserUseCase: ListUserUseCase,
    private profileUserUseCase: ProfileUserUseCase,
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

  //   @Put(':id')
  //   async updateUser(@Param('id') id: string, @Request() req, @Body() data) {
  //     return this.userUseCase.updateUser(id, req.user, data);
  //   }

  //   @Delete(':id')
  //   async deleteUser(@Param('id') id: string, @Request() req) {
  //     return this.userUseCase.deleteUser(id, req.user);
  //   }

  //   @Post()
  //   @UseGuards(RolesGuard)
  //   @Roles('ADMIN')
  //   async createUser(@Request() req, @Body() data) {
  //     return this.userUseCase.createUser(req.user, data);
  //   }
}
