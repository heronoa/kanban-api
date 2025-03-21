import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  public async execute(user: { id: string; email: string }): Promise<string> {
    return await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
    });
  }
}
