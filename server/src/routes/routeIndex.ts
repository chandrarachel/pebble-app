import { Router } from "express";
import { authRouter } from "./authRouter";
import { taskRouter } from "./taskRouter";

export const router = Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);