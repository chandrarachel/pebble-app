import * as taskRepo from "../repository/taskRepository"
import { type Task } from "../types/Task";


export class taskServices {
    async getTaskById(id: string) {
        try{
            return taskRepo.getTaskById(id);
        } catch (error) {
            console.error(`Error getting task by ID ${id}:`, error);
            throw new Error("Could not retrieve task");
        }
    }

    async getUserTasks(userId: string) {
        try {
            return await taskRepo.getUserTasks(userId);
        } catch (error) {
            console.error(`Error getting tasks for user ${userId}:`, error);
            throw new Error("Could not retrieve user tasks");
        }
    }

    async createTask(task: Partial<Task>) {
        try {
            return await taskRepo.createTask(task);
        } catch (error) {
            console.error("Error creating task:", error);
            throw new Error("Could not create task");
        }
    }

    async updateTask(id: string, task: Partial<Task>) {
        try {
            return await taskRepo.updateTask(id, task);
        } catch (error) {
            console.error(`Error updating task ${id}:`, error);
            throw new Error("Could not update task");
        }
    }

    async deleteTask(id: string) {
        try {
            return await taskRepo.deleteTask(id);
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error);
            throw new Error("Could not delete task");
        }
    }
}