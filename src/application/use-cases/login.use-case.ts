// src/application/use-cases/login.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/domain/dto/login.dto';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';
import { UserRepository } from '@/domain/repositories/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
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

    const token = this.createToken(user);

    return { user, token };
  }

  private createToken(user: { id: string; email: string }): string {
    return this.jwtService.sign({ userId: user.id, email: user.email });
  }
}
