import { Router } from "express";
import { TaskController } from "../controller/taskController";

export const taskRouter = Router();

const taskController = new TaskController();

taskRouter.get('/', taskController.getUserTasks.bind(taskController));
taskRouter.post('/create', taskController.createTask.bind(taskController));
taskRouter.put('/:id', taskController.updateTask.bind(taskController));
taskRouter.get('/:id', taskController.getTaskById.bind(taskController));
taskRouter.delete('/:id', taskController.deleteTask.bind(taskController));