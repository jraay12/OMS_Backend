import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";

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

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as JwtPayload;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }

   verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}
