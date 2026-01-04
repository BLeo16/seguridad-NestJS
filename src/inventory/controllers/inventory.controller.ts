import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { InventoryMovementDto } from '../dtos/InventoryMovementDto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async inventoryLog() {
    return this.inventoryService.inventoryLog();
  }
  @Post('in')
  async inventoryIn(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryIn(dto);
  }

  @Post('out')
  async inventoryOut(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryOut(dto);
  }

  @Post('adjust')
  async inventoryAdjust(@Body() dto: InventoryMovementDto) {
    return this.inventoryService.inventoryAdjust(dto);
  }

  @Get('product/:id')
  async getProductStock(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getProductStock(id);
  }
}