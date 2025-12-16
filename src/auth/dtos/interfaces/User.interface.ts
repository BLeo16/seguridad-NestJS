import { RoleInterface } from "./Role.interface";
import { UserStatus } from '@prisma/client';

export interface ValidateUser {
    createdAt: Date;
    updatedAt: Date;
    roles: RoleInterface[];
}

export interface User {
    email: string;
    id: number;
    name: string | null;
    status: UserStatus;
}

export interface UserWithoutPassword extends User, ValidateUser { }
