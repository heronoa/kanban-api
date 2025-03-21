// src/application/use-cases/register.use-case.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@/domain/dto/register.dto';
import { UserRepository } from '@/domain/repositories/user.repository';
import { AuthResponseDto } from '@/domain/dto/auth-reponse.dto';
import { CreateTokenUseCase } from './create-token.use-case';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createTokenUseCase: CreateTokenUseCase,
  ) {}

  async execute(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    let userExists: boolean;
    try {
      const user = await this.userRepository.findByEmail(email);
      userExists = user !== null;
    } catch (error) {
      throw new UnauthorizedException('Error checking user existence ' + error);
    }
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'USER',
    });

    const token = await this.createTokenUseCase.execute(user);

    return { user, token };
  }
}
