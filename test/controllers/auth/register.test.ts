import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/infrastructure/http/controllers/auth/auth.controller';
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case';
import { JwtService } from '@nestjs/jwt';

describe('AuthController - Register', () => {
  let authController: AuthController;
  let registerUseCase: RegisterUseCase;

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
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  it('should successfully register a user', async () => {
    const mockUser: AuthResponseDto = {
      token: 'mockToken',
      user: {
        id: '1',
        email: 'test@email.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
      },
    };

    (registerUseCase.execute as jest.Mock).mockResolvedValue(mockUser);

    const result = await authController.register({
      email: 'test@email.com',
      password: '123456',
      name: 'Test User',
    });

    expect(result).toEqual(mockUser);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(registerUseCase.execute).toHaveBeenCalledWith({
      email: 'test@email.com',
      name: 'Test User',
      password: '123456',
    });
  });
});
