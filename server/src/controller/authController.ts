import { AuthService } from "../services/authServices";
import dotenv from 'dotenv';
import { Request, Response } from "express";

dotenv.config();

export class AuthController {
    private authService: AuthService = new AuthService(process.env.JWT_SECRET || 'default_secret');

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email or password is missing" });
            return;
        }
        try {
            const { user, token } = await this.authService.login(email, password);
            res.status(200).json({ user, token });
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: err });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        const { username, email, password, role, phoneNumber } = req.body;
        if (!username || !email || !password || !role || !phoneNumber) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        try {
            const user = { id: '', username, email, role, phoneNumber };
            await this.authService.register(user, password);
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(400).json({ message: err });
        }
    }

}
