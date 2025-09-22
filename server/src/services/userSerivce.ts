import * as userRepo from "../repository/userRepository.js";
import { User } from "../types/User";

export class userService {
    async updateUser(id: string, user: Partial<User>) {
        return userRepo.updateUser(id, user);
    }
}