import { PrismaClient, User } from '@prisma/client';

// Repository Pattern - similar cu JpaRepository în Spring
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  // Găsește user după email
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Găsește user după ID
  async findById(id: string): Promise<User | null> {
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
  }): Promise<User> {
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