import { PrismaClient } from '@prisma/client';

// Repository Pattern - similar cu JpaRepository în Spring
export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Găsește user după email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Găsește user după ID
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Creează un user nou
  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  // Verifică dacă email-ul există deja
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}