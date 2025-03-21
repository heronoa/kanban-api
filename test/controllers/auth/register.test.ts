import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/infra/http/controllers/auth.controller';
import { RegisterUserUseCase } from '@/app/use-cases/register-user.use-case';
import { UserRepository } from '@/domain/repositories/user.repository';

describe('AuthController - Register', () => {
  let authController: AuthController;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  it('deve registrar um usuário com sucesso', async () => {
    const mockUser = { id: '1', email: 'test@email.com', role: 'user' };
    jest.spyOn(registerUserUseCase, 'execute').mockResolvedValue(mockUser);

    const result = await authController.register({
      email: 'test@email.com',
      password: '123456',
    });

    expect(result).toEqual(mockUser);
    expect(registerUserUseCase.execute).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: '123456',
    });
  });
});
