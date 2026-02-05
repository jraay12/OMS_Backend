import { Router } from "express";
import { UserController } from "./user.controller";
import { PrismaUserRepository } from "./prisma-user.repository";
import { UserService } from "./user.service";
const routes = Router();

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

routes.post('/register', userController.register)

export default routes;
