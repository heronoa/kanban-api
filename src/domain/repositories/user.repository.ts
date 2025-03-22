import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { User } from '@prisma/client';
import { User as UserDTO } from '../dto/user/user.dto';
import { UserResponse } from '../dto/auth/auth-reponse.dto';

interface UserRepositoryType {
  create(data: UserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
  paginatedList({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ users: UserResponse[]; totalCount: number }>;
}

@Injectable()
export class UserRepository implements UserRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async paginatedList({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ users: UserResponse[]; totalCount: number }> {
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        omit: {
          password: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, totalCount };
  }

  async create(data: UserDTO): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
