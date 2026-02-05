import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
export class User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "ADMIN" | "USER";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    email: string;
    passwordHash: string;
    name: string
    role?: "ADMIN" | "USER";
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error("Invalid email format");
    }

    this.id = data.id ?? uuidv4();
    this.email = data.email;
    this.name = data.name
    this.passwordHash = data.passwordHash;
    this.role = data.role ?? "USER";
    this.isVerified = data.isVerified ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  static fromPrisma(user: any): User {
    return new User({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.password_hash, 
      role: user.role as "ADMIN" | "USER",
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,

    });
  }

  async setPassword(password: string) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hash = await bcrypt.hash(password, 10);
    this.passwordHash = hash;
    this.updatedAt = new Date();
  }

  getPasswordHashed(): string {
    return this.passwordHash;
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
