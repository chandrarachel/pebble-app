import { AuthService } from "../services/authServices";
import AuthRequest from "../types/authRequest";
import { Response } from "express";
import dotenv from 'dotenv';
import { taskServices } from "../services/taskServices";

dotenv.config();

export class TaskController {
    private taskService: taskServices = new taskServices();

    async getTaskById(req: AuthRequest, res: Response): Promise<void> {
        const taskId = req.params.id;
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const task = await this.taskService.getTaskById(taskId);
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async getUserTasks(req: AuthRequest, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const tasks = await this.taskService.getUserTasks(req.user.id);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
    
    async createTask(req: AuthRequest, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, description, status, date, location } = req.body;
        if (!title || !description || !status || !date) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        try {
            const newTask = await this.taskService.createTask({
                title,
                description,
                status,
                user: req.user.id,
                location: location || "",
            });
            res.status(201).json(newTask);
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async updateTask(req: AuthRequest, res: Response): Promise<void> {
        const taskId = req.params.id;
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, description, status, date, location } = req.body;
        if (!title && !description && !status && !date && !location) {
            res.status(400).json({ message: "No fields to update" });
            return;
        }
        try {
            const updatedTask = await this.taskService.updateTask(taskId, {
                title,
                description,
                status,
                location,
            });
            if (!updatedTask) {
                res.status(404).json({ message: "Task not found" });
                return;
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async deleteTask(req: AuthRequest, res: Response): Promise<void> {
        const taskId = req.params.id;
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const success = await this.taskService.deleteTask(taskId);
            if (!success) {
                res.status(404).json({ message: "Task not found" });
                return;
            }
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}