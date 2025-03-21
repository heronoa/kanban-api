import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Connection', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database successfully', async () => {
    try {
      await prisma.$connect();
      expect(true).toBe(true);
    } catch (error) {
      console.error('Database connection failed:', error);
      fail('Failed to connect to the database');
    }
  });

  it('should retrieve database version', async () => {
    const result = await prisma.$queryRaw<{ version: string }[]>`
      SELECT version();
    `;
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    console.log('PostgreSQL Version:', result[0].version);
  });
});
