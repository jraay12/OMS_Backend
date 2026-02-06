import { v4 as uuidv4 } from "uuid";
import { User } from "./user.entity";
export class RefreshToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  user?: User;

  constructor(data: {
    token: string;
    userId: string;
    id?: string;
    createdAt?: Date;
    expiresAt?: Date;
    user?: User;
  }) {
    this.id = data.id ?? uuidv4();
    this.token = data.token;
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date();
    this.expiresAt =
      data.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    this.user = data.user;
  }

  static fromPrisma(data: any): RefreshToken {
    return new RefreshToken({
      id: data.id,
      token: data.token,
      userId: data.user_id,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      user: data.user ? User.fromPrisma(data.user) : undefined,
    });
  }
}
