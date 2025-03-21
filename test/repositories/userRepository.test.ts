import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { UserRepository } from '@/domain/repositories/user.repository';
import { User, Role } from '@prisma/client';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prisma: PrismaService;
  let testUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    testUser = await userRepository.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: Role.USER,
    });

    expect(testUser).toBeDefined();
    expect(testUser.id).toBeDefined();
    expect(testUser.email).toBe('test@example.com');
  });

  it('should retrieve a user by email', async () => {
    const user = await userRepository.findByEmail(testUser.email);

    expect(user).toBeDefined();
    expect(user?.email).toBe(testUser.email);
  });

  it('should retrieve a user by ID', async () => {
    const user = await userRepository.findById(testUser.id);

    expect(user).toBeDefined();
    expect(user?.id).toBe(testUser.id);
  });

  it('should update a user', async () => {
    const updatedUser = await userRepository.update(testUser.id, {
      name: 'Updated User',
    });

    expect(updatedUser.name).toBe('Updated User');
  });

  it('should delete a user', async () => {
    await userRepository.delete(testUser.id);

    const deletedUser = await userRepository.findById(testUser.id);

    expect(deletedUser).toBeNull();
  });
});
