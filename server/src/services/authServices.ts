import jwt from 'jsonwebtoken';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '../repository/userRepository';

export class AuthService {
    private readonly jwtSecret: string;

    constructor(jwtSecret: string) {
        this.jwtSecret = jwtSecret;
    }

    async generateToken(userId: string, username:string, email: string, role: string, phoneNumber: string) : Promise<string> {
        const payload = { userId, username, email, role, phoneNumber };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: '30d' });
    }

    async verifyToken(token: string) : Promise<User | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as User;
            return decoded;
        } catch (err) {
            return null;
        }
    }

    async hashPassword (password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    async login(email: string, password: string){
        const user = await getUserByEmail(email);
        if(!user){
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await this.comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = await this.generateToken(user.id, user.username, user.email, user.role, user.phoneNumber);

        return { token, user };
    }

    async register(user: User, password: string){
        const existingUser = await getUserByEmail(user.email);
        if(existingUser){
            throw new Error('Email already in use');
        }

        const passwordHash = await this.hashPassword(password);
        
        try{
            await createUser(user, passwordHash);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create user");
        }
    }

}