import { PermissionInterface } from "./Permission.inteface";

export interface RoleInterface {
    id: number;
    name: string;
    permissions: PermissionInterface[];
}