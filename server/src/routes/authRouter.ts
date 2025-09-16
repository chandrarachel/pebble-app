import { Router } from "express";
import { AuthController } from "../controller/authController";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/register', authController.register.bind(authController));