import { pgTable, varchar, date, uuid, foreignKey } from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull().default(''),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
})


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
    role: varchar("role", { length: 10 }).notNull().default('user'),
    phoneNumber: varchar("phone_number", { length: 15 }).notNull().default(''),
    groupId: uuid("group_id").references(() => groups.id),
})

export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull().default(''),
    status: varchar("status", { length: 20 }).notNull().default('pending'),
    location: varchar("location", { length: 100 }).notNull().default(''),
    dueDate: date("due_date").notNull().defaultNow(),
    createdAt: date("created_at").notNull().defaultNow(),
    asignee: uuid("user_id").references(() => users.id),
})