import { Injectable } from '@nestjs/common';
import { ListUserDTO } from '@/domain/dto/user/list-user.dto';
import { UserRepository } from '@/domain/repositories/user.repository';

@Injectable()
export class ListUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    page = 1,
    perPage = 10,
  }: {
    page?: number;
    perPage?: number;
    role?: string;
  }): Promise<ListUserDTO> {
    const { users, totalCount } = await this.userRepository.paginatedList({
      page,
      perPage,
    });

    const totalPages = Math.ceil(totalCount / perPage);

    return { users, totalCount, page, perPage, totalPages };
  }
}
