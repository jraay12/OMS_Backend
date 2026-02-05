import { prisma } from "../../prisma/prismaClient";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

export class PrismaUserRepository implements UserRepository {
  async registerUser(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password_hash: user.getPasswordHashed(),
        name: user.name,
        is_verified: user.isVerified,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? User.fromPrisma(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? User.fromPrisma(user) : null;
  }
}
