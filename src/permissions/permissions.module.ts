import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";
import { PermissionService } from "./services/permissions.service";
import { PermissionController } from "./controllers/permissions.controller";

@Module({
    imports: [PrismaModule],
    providers: [PermissionService],
    controllers: [PermissionController],
})

export class PermissionModule{}