import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from '@/domain/dto/login.dto';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/register.use-case';
import { RegisterDto } from '@/domain/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }
}
