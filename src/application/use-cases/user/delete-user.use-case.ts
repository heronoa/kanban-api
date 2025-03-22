import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/dto/user/user.dto';
import { UserResponse } from '@/domain/dto/auth/auth-reponse.dto';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    id,
    user,
  }: {
    id: string;
    user: UserResponse;
  }): Promise<User> {
    if (user.role === 'USER' && user.id !== id) {
      throw new ForbiddenException('Insufficient permission');
    }

    const response = await this.userRepository.delete(id);

    return response;
  }
}
