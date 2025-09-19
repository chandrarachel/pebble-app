import { User } from "./User";
import { Request } from "express";

export default interface AuthRequest extends Request{
    user?: User;
}