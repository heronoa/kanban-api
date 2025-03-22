import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user/user.controller';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case';
import { AuthGuard } from '@/infrastructure/http/middlewares/AuthGuard/auth.guard';
import { RolesGuard } from '@/infrastructure/http/middlewares/RoleGuard/role.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from '@/shared/types/auth-request';

describe('UserController', () => {
  let userController: UserController;
  let listUserUseCase: ListUserUseCase;
  let profileUserUseCase: ProfileUserUseCase;

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
    listUserUseCase = module.get<ListUserUseCase>(ListUserUseCase);
    profileUserUseCase = module.get<ProfileUserUseCase>(ProfileUserUseCase);
  });

  describe('listUsers', () => {
    it('should return a paginated list of users', async () => {
      const mockUsers = {
        users: [
          {
            id: '1',
            email: 'user@email.com',
            name: 'User Name',
            role: 'USER' as const,
            createdAt: new Date(),
          },
        ],
        totalCount: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };
      jest.spyOn(listUserUseCase, 'execute').mockResolvedValue(mockUsers);

      const result = await userController.listUsers(1, 10);

      expect(result).toEqual(mockUsers);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(listUserUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
      });
    });
  });

  describe('getProfile', () => {
    it('should return the profile of the logged-in user', async () => {
      const mockUser = {
        id: '1',
        email: 'user@email.com',
        name: 'User Name',
        password: 'hashedpassword123',
        role: 'USER' as const,
        createdAt: new Date(),
      };
      jest.spyOn(profileUserUseCase, 'execute').mockResolvedValue(mockUser);

      const req = { user: { id: '1' } };
      const result = await userController.getProfile(req as AuthRequest);

      expect(result).toEqual(mockUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(profileUserUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('getUserById', () => {
    it('should return the user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'user@email.com',
        name: 'User Name',
        password: 'hashedpassword123',
        role: 'USER' as const,
        createdAt: new Date(),
      };
      jest.spyOn(profileUserUseCase, 'execute').mockResolvedValue(mockUser);

      const result = await userController.getUserById('1');

      expect(result).toEqual(mockUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(profileUserUseCase.execute).toHaveBeenCalledWith('1');
    });
  });
});
