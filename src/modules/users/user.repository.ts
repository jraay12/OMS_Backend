import { User } from "./user.entity";

export interface UserRepository {
  registerUser(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>
}
