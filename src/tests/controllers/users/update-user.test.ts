import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';

describe('UserController - Update User', () => {
  let userController: UserController;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UpdateUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('deve atualizar os dados de um usuário', async () => {
    const mockUser = { id: '1', email: 'user@email.com' };
    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(mockUser);

    const result = await userController.update('1', {
      email: 'new@email.com',
    });

    expect(result).toEqual(mockUser);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith('1', {
      email: 'new@email.com',
    });
  });
});
