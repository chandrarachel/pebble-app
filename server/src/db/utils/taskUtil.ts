import { type Task } from "../../model/Task.js";
import { db } from "../db.js";
import { tasks } from "../schema.js";
import { eq } from "drizzle-orm";


export const getTaskById = async (id: string): Promise<Task | null> => {
    const task = await db.select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1)
        .then(res => res[0] || null) as Task | null;
        
    return task;
}

export const getUserTasks = async (userId: string): Promise<Task[]> => {
    const userTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.user, userId))
        .then(res => res as Task[]);
        
    return userTasks;
}

export const createTask = async (task : Omit<Task, 'id'> & Partial<Pick<Task, 'id'>>): Promise<Task> => {
    const [newTask] = await db.insert(tasks)
        .values(task)
        .returning()
        .then(res => res as Task[]);

    return newTask as Task;
}

export const updateTask = async (id: string, task: Partial<Omit<Task, 'id'>>): Promise<Task | null> => {
    const [updatedTask] = await db.update(tasks)
        .set(task)
        .where(eq(tasks.id, id))
        .returning()
        .then(res => res as Task[]);

    return updatedTask || null;
}

export const deleteTask = async (id: string): Promise<boolean> => {
    const result = await db.delete(tasks)
        .where(eq(tasks.id, id))
        .then(res => res);

    return result > 0;
}