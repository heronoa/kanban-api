// src/application/use-cases/auth/refresh-token.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenRepository } from '@/domain/repositories/refreshToken.repository';
import { UserRepository } from '@/domain/repositories/user.repository';
import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshToken: RefreshTokenRepository,
    private readonly userRepo: UserRepository,
  ) {}

  public async execute(refreshToken: string): Promise<AuthResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session = await this.refreshToken.findByToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const user = await this.userRepo.findById(session.userId as string);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = uuidv4();
    await this.refreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
    });

    await this.refreshToken.delete(refreshToken);

    return {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
