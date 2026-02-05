import { Router } from "express";
import { UserController } from "./user.controller";
import { PrismaUserRepository } from "./prisma-user.repository";
import { UserService } from "./user.service";
import { JWTServices } from "../../utils/jwt";

const routes = Router();

const jwtService = new JWTServices(
  process.env.JWT_SECRET! || process.env.JWT_EXPIRES || "15m",
  process.env.REFRESH_SECRET! || process.env.REFRESH_EXPIRE || "7d",
);

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository, jwtService);
const userController = new UserController(userService);

routes.post("/register", userController.register);
routes.post("/login", userController.login);

export default routes;
