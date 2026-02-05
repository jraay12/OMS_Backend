import jwt, { SignOptions, Secret } from "jsonwebtoken";

export class JWTServices {
  constructor(
    private readonly secret: Secret,
    private readonly refreshTokenSecret: Secret,

    private readonly expiresIn: SignOptions["expiresIn"] = "15m",
  ) {}

  generate(userId: string, role: string): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };

    return jwt.sign({ userId, role }, this.secret, options);
  }

  generateRefreshToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };

    return jwt.sign({ userId }, this.refreshTokenSecret, options);
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
