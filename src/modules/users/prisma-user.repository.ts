import { prisma } from "../../prisma/prismaClient";
import { RefreshToken } from "./refreshToken.entity";
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
        updated_at: user.updatedAt,
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

  async isEmailVerified(email: string): Promise<boolean> {
    const verifiedUser = await prisma.user.findUnique({
      where: {
        email,
        is_verified: true,
      },
    });

    return verifiedUser ? true : false;
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        user_id,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const exisitngToken = await prisma.session.findUnique({
      include: {
        user: true,
      },
      where: {
        token,
      },
    });

    return exisitngToken ? RefreshToken.fromPrisma(exisitngToken) : null;
  }

  async deleteToken(token: string): Promise<void> {
    await prisma.session.delete({
      where: {
        token,
      },
    });
  }

  async rotateRefreshToken(
    sessionId: string,
    newToken: string,
  ): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        token: newToken,
        expires_at: expiresAt,
      },
      include: { user: true },
    });

    return RefreshToken.fromPrisma(updatedSession);
  }
}
