import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case';
import { UserRepository } from '@/domain/repositories/user.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateTokenUseCase } from '@/application/use-cases/auth/create-token.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from '@/domain/repositories/refreshToken.repository';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret: secret,
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    CreateTokenUseCase,
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    UserRepository,
    RefreshTokenRepository,
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
