import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/infrastructure/http/controllers/auth/auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';

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
    const mockToken: AuthResponseDto = {
      token: 'token',
      user: {
        id: '1',
        email: '',
        name: '',
        role: 'ADMIN',
        createdAt: new Date(),
      },
    };
    jest.spyOn(loginUseCase, 'execute').mockResolvedValue(mockToken);

    const result = await authController.login({
      email: 'test@email.com',
      password: '123456',
    });

    expect(result).toEqual(mockToken);
    expect((loginUseCase.execute as jest.Mock).mock.calls[0][0]).toEqual({
      email: 'test@email.com',
      password: '123456',
    });
  });
});
