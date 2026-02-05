import { UserRepository } from "./user.repository";
import { RegisterUserDTO } from "./UserDTO";
import { User } from "./user.entity";
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(data: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(data.email);

    if (existingUser) throw new Error("User email already exists.");

    const user = new User({
      email: data.email,
      passwordHash: "",
      name: data.name,
      
    });

    await user.setPassword(data.password);

    await this.userRepo.registerUser(user)

    return user;
  }
}
