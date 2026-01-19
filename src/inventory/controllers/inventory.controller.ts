import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Query, Optional } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { InventoryMovementDto } from '../dtos/InventoryMovementDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { HasPermission } from 'src/auth/decorators/has-permission.decorator';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async inventoryLog(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('type') type: 'IN' | 'OUT' | 'ADJUSTMENT' | undefined,
  ) {
    return this.inventoryService.inventoryLog(page, limit, type);
  }
  @HasPermission('EDITAR_PRODUCTOS')
  @Post('in')
  async inventoryIn(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryIn(dto);
  }

  @HasPermission('EDITAR_PRODUCTOS')
  @Post('out')
  async inventoryOut(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryOut(dto);
  }

  @HasPermission('EDITAR_PRODUCTOS')
  @Post('adjust')
  async inventoryAdjust(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryAdjust(dto);
  }

  @HasPermission('VER_PRODUCTOS')
  @Get('product/:id')
  async getProductStock(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getProductStock(id);
  }
}