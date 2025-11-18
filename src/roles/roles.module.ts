import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';

@Module({
  imports: [PrismaModule],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
