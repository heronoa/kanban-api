import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/infrastructure/http/controllers/auth/auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/register.use-case';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';

describe('AuthController - Login', () => {
  let authController: AuthController;
  let loginUseCase: LoginUseCase;
  // let registerUseCase: RegisterUseCase;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RegisterUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should successfully login and return a token', async () => {
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
    jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

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
