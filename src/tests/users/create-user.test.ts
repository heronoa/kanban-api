import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';

describe('UserController - Create User', () => {
  let userController: UserController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('deve criar um usuário com sucesso', async () => {
    const mockUser = { id: '1', email: 'user@email.com' };
    jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(mockUser);

    const result = await userController.create({
      email: 'user@email.com',
      password: '123456',
      role: 'user',
    });

    expect(result).toEqual(mockUser);
    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: '123456',
    });
  });
});
