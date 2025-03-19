import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id.use-case';

describe('UserController', () => {
  let userController: UserController;
  let getUserByIdUseCase: GetUserByIdUseCase;
  let getUsersUseCase: GetUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: GetUserByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUsersUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    getUsersUseCase = module.get<GetUsersUseCase>(GetUsersUseCase);
  });

  describe('Get User By ID', () => {
    it('deve retornar os detalhes de um usuário', async () => {
      const mockUser = { id: '1', email: 'user@email.com' };
      jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(mockUser);

      const result = await userController.getById('1');

      expect(result).toEqual(mockUser);
      expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('Get Users', () => {
    it('deve retornar uma lista de usuários paginada', async () => {
      const mockUsers = [{ id: '1', email: 'user@email.com' }];
      jest.spyOn(getUsersUseCase, 'execute').mockResolvedValue(mockUsers);

      const result = await userController.getAll({ page: 1, limit: 10 });

      expect(result).toEqual(mockUsers);
      expect(getUsersUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });
});
