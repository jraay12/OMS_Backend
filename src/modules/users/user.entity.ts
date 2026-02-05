import bcrypt from "bcrypt";

export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "USER";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    role?: "ADMIN" | "USER";
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error("Invalid email format");
    }

    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role ?? "USER";
    this.isVerified = data.isVerified ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();


  }

  async setPassword(password: string) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hash = await bcrypt.hash(password, 10);
    this.passwordHash = hash;
    this.updatedAt = new Date()
  }

  getPasswordHashed(): string {
    return this.passwordHash;
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
