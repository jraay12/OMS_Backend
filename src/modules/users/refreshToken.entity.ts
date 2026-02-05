import { v4 as uuidv4 } from "uuid";

export class RefreshToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;

  constructor(data: {
    token: string;
    userId: string;
    id?: string;
    createdAt?: Date;
    expiresAt?: Date;
  }) {
    this.id = data.id ?? uuidv4();
    this.token = data.token;
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date();
    this.expiresAt = data.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  static fromPrisma(data: any): RefreshToken {
    return new RefreshToken({
      id: data.id,
      token: data.token,
      userId: data.userId,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
    });
  }
}
