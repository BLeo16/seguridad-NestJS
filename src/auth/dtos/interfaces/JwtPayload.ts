import { UserStatus } from '@prisma/client';
export interface JwtPayload {
    sub: number;
    email: string;
    status: UserStatus;
    roles: string[];
    permissions: string[];
    iat?: number;
    exp?: number;
}