import { UserRepository } from "./user.repository";
import { LoginUserDTO, RegisterUserDTO } from "./UserDTO";
import { User } from "./user.entity";
import { JWTServices } from "../../utils/jwt";
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private jwtUtils: JWTServices,
  ) {}

  async register(data: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(data.email);

    if (existingUser) throw new Error("User email already exists.");

    const user = new User({
      email: data.email,
      passwordHash: "",
      name: data.name,
    });

    await user.setPassword(data.password);

    await this.userRepo.registerUser(user);

    return user;
  }

  async login(
    data: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new Error("User is not yet registered");
    const isVerified = await this.userRepo.isEmailVerified(data.email);

    if (!isVerified)
      throw new Error("User not yet verified, please check your email");

    const isValid = await user.comparePassword(data.password);

    if (!isValid) throw new Error("Invalid credentials");

    const accessToken = this.jwtUtils.generate(user.id, user.role);
    const refreshToken = this.jwtUtils.generateRefreshToken(user.id);

    if (refreshToken) {
      await this.userRepo.storeRefreshToken(user.id, refreshToken);
    }

    return { accessToken, refreshToken };
  }
}
