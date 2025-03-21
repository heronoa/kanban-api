// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/register.use-case';
import { UserRepository } from '@/domain/repositories/user.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateTokenUseCase } from '@/application/use-cases/create-token.use-case';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    CreateTokenUseCase,
    LoginUseCase,
    RegisterUseCase,
    UserRepository,
    PrismaService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
