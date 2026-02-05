import { UserService } from "./user.service";
import { Request, Response } from "express";
import { RegisterUserSchema, RegisterUserDTO } from "./UserDTO";

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
}
