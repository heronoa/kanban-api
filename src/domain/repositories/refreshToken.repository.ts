import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { RefreshToken } from '@prisma/client';
import { CreateRefreshTokenDto } from '../dto/auth/create-refresh-token.dto';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type RefreshTokenResult = RefreshToken | null;

interface RefreshTokenRepositoryType {
  create(data: CreateRefreshTokenDto): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshTokenResult>;
  delete(id: string): Promise<RefreshToken>;
}

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefreshTokenDto): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findByToken(token: string): Promise<RefreshTokenResult> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async delete(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
