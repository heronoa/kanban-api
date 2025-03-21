import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from '@/domain/dto/login.dto';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/register.use-case';
import { RegisterDto } from '@/domain/dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login - Autheticate the user' })
  @ApiResponse({
    status: 200,
    description: 'User authenticated',
    type: AuthResponseDto,
    example: {
      value: {
        user: {
          id: '1',
          email: 'test@email.com',
          name: 'Test User',
          role: 'USER',
          createdAt: '2021-09-01T00:00:00.000Z',
        },
        token: 'hashedtoken',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({
    type: LoginDto,
    required: true,
    examples: {
      example: {
        value: { email: 'test@email.com', password: '123456' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register - Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: AuthResponseDto,
    example: {
      value: {
        user: {
          id: '1',
          email: 'test@email.com',
          name: 'Test User',
          role: 'USER',
          createdAt: '2021-09-01T00:00:00.000Z',
        },
        token: 'hashedtoken',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }
}
