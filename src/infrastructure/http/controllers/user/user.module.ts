import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from '@/domain/repositories/user.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AuthGuard } from '../../middlewares/AuthGuard/auth.guard';
import { ListUserUseCase } from '@/application/use-cases/user/list-users.use-case';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileUserUseCase } from '@/application/use-cases/user/get-profile.use-case';

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
    UserRepository,
    PrismaService,
    AuthGuard,
    ListUserUseCase,
    ProfileUserUseCase,
  ],
  controllers: [UserController],
})
export class UserModule {}
