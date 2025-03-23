/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user/user.controller';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { RolesGuard } from '@/infrastructure/http/middlewares/RoleGuard/role.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { User } from '@/domain/dto/user/user.dto';

describe('UserController - Delete User', () => {
  let userController: UserController;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: ListUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ProfileUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteUserUseCase,
          useValue: { execute: jest.fn() },
        },
        JwtService,
        AuthGuard,
        AuthGuard,
        RolesGuard,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should delete a user successfully', async () => {
    const mockUser: User = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword123',
      role: 'USER',
    };

    jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(mockUser);

    const req = { user: { id: '1' } } as AuthRequest;
    const result = await userController.deleteUser('1', req);

    expect(result).toEqual(mockUser);
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: req.user,
    });
  });
});
