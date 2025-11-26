import { RoleInterface } from "./Role.interface";

export interface ValidateUser {
    createdAt: Date;
    updatedAt: Date;
    roles: RoleInterface[];
}

export interface User {
    email: string;
    id: number;
    name: string | null;
}

export interface UserWithoutPassword extends User, ValidateUser { }
