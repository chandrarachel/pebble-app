import { users } from "../schema.js";
import { db } from "../db.js";
import type { User } from "../../model/User.js";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string): Promise<User | null> => {
    const user = await db.select()
        .from(users)
        .where(eq(users.id, id))
        .then(rows => rows[0] ?? null)

    return user;
};


export const deleteUser = async (id: string): Promise<void> => {
    await db.delete(users).where(eq(users.id, id));
}

export const createUser = async (user: Partial<User>, passwordHash: string): Promise<void> => {
    const newUser = {
        username: user.username!,
        email: user.email!,
        passwordHash: passwordHash!,
        phoneNumber: user.phoneNumber!
    }
    await db.insert(users).values(newUser);
}

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
    const { role, ...userWithoutRole } = user;
    const updatedUser = {
        ...userWithoutRole,
        updatedAt: new Date().toISOString()
    }
    await db.update(users).set(updatedUser).where(eq(users.id, id));
}