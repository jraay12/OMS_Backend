import { UserService } from "./user.service";
import { Request, Response } from "express";
import {
  RegisterUserSchema,
  RegisterUserDTO,
  LoginUserDTO,
  LoginUserSchema,
} from "./UserDTO";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response) => {
    try {
      const dto: RegisterUserDTO = RegisterUserSchema.parse(req.body);
      const user = await this.userService.register(dto);
      const { passwordHash, ...userData } = user;
      res.status(201).json({ user: userData });
    } catch (err: any) {
      if (err?.issues) {
        res.status(400).json({ errors: err.issues });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const dto: LoginUserDTO = LoginUserSchema.parse(req.body);
      const { accessToken, refreshToken } = await this.userService.login(dto);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ accessToken: accessToken });
    } catch (err: any) {
      if (err?.issues) {
        res.status(400).json({ errors: err.issues });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;

      if (!oldRefreshToken)
        return res.status(401).json({ error: "Missing token" });
      const { accessToken, newRefreshToken } =
        await this.userService.refreshToken(oldRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ accessToken });
    } catch (err: any) {
      if (err?.issues) {
        res.status(400).json({ errors: err.issues });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  };
}
