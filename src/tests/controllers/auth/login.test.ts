import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/infrastructure/http/controllers/auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';

describe('AuthController - Login', () => {
  let authController: AuthController;
  let loginUseCase: LoginUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('deve realizar login com sucesso e retornar um token', async () => {
    const mockToken = { access_token: 'jwt-token' };
    jest.spyOn(loginUseCase, 'execute').mockResolvedValue(mockToken);

    const result = await authController.login({
      email: 'test@email.com',
      password: '123456',
    });

    expect(result).toEqual(mockToken);
    expect(loginUseCase.execute).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: '123456',
    });
  });
});
