import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { DeleteUserUseCase } from '@/application/use-cases/delete-user.use-case';

describe('UserController - Delete User', () => {
  let userController: UserController;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: DeleteUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('deve remover um usuário com sucesso', async () => {
    jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(undefined);

    const result = await userController.delete('1');

    expect(result).toBeUndefined();
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith('1');
  });
});
