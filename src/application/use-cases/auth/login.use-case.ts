import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@/domain/dto/auth/login.dto';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';
import { UserRepository } from '@/domain/repositories/user.repository';
import { CreateTokenUseCase } from './create-token.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createTokenUseCase: CreateTokenUseCase,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.createTokenUseCase.execute(user);

    return { user, token };
  }
}
