import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  public async execute(user: UserResponse): Promise<string> {
    return await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
