import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/domain/repositories/user.repository';

@Injectable()
export class CreateTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  public execute(user: { id: string; email: string }): string {
    return this.jwtService.sign({ userId: user.id, email: user.email });
  }
}
