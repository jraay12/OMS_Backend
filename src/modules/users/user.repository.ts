import { User } from "./user.entity";

export interface UserRepository {
  registerUser(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  isEmailVerified(email: string): Promise<boolean>;
  storeRefreshToken(user_id: string, token: string) : Promise<void>
}
