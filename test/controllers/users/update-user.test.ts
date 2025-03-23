/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user/user.controller';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { AuthRequest } from '@/shared/types/auth-request';
import { User } from '@/domain/entities/user.entity';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { RolesGuard } from '@/infrastructure/http/middlewares/RoleGuard/role.guard';
import { JwtService } from '@nestjs/jwt';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';

describe('UserController - Update User', () => {
  let userController: UserController;
  let updateUserUseCase: UpdateUserUseCase;

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
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should update user data', async () => {
    const mockUser: User = {
      id: '1',
      email: 'user@email.com',
      name: 'User Name',
      password: 'hashedpassword123',
      role: 'USER' as const,
      createdAt: new Date(),
      projects: [],
      tasks: [],
      validateEmail: function (): boolean {
        throw new Error('Function not implemented.');
      },
    };
    const req: AuthRequest = {
      user: { id: '1', email: 'user@email.com' },
    } as AuthRequest;
    const updateData: Partial<User> = { email: 'new@email.com' };

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(mockUser);

    const result = await userController.updateUser('1', req, updateData);

    expect(result).toEqual(mockUser);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      user: req.user,
      data: updateData,
    });
  });
});
