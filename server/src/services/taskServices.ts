import * as taskRepo from "../repository/taskRepository"
import { type Task } from "../types/Task";


export class taskServices {
    async getTaskById(id: string) {
        return taskRepo.getTaskById(id);
    }

    async getUserTasks(userId: string) {
        return taskRepo.getUserTasks(userId);
    }

    async createTask(task: Omit<Task, 'id'> & Partial<Pick<Task, 'id'>>) {
        return taskRepo.createTask(task);
    }

    async updateTask(id: string, task: Partial<Omit<Task, 'id'>>) {
        return taskRepo.updateTask(id, task);
    }

    async deleteTask(id: string) {
        return taskRepo.deleteTask(id);
    }
}