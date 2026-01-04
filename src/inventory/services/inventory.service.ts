import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InventoryMovementDto } from '../dtos/InventoryMovementDto';
import { InventoryMovementType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getProductStock(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return { stock: product.stock };
  }

  async inventoryLog() {
    return this.prisma.inventoryMovement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async inventoryIn(dto: InventoryMovementDto) {
    return this.updateInventory(dto, InventoryMovementType.IN);
  }

  async inventoryOut(dto: InventoryMovementDto) {
    return this.updateInventory(dto, InventoryMovementType.OUT);
  }

  async inventoryAdjust(dto: InventoryMovementDto) {
    return this.updateInventory(dto, InventoryMovementType.ADJUSTMENT);
  }

  private async updateInventory(dto: InventoryMovementDto, type: InventoryMovementType) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${dto.productId} no encontrado`);
    }

    let newStock: number;
    const previousStock = product.stock;

    if (type === InventoryMovementType.IN) {
      newStock = previousStock + dto.quantity;
    } else if (type === InventoryMovementType.OUT) {
      if (previousStock < dto.quantity) {
        throw new BadRequestException('Stock insuficiente');
      }
      newStock = previousStock - dto.quantity;
    } else if (type === InventoryMovementType.ADJUSTMENT) {
      newStock = dto.quantity;
    }

    // Update product stock
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stock: newStock },
    });

    // Create movement record
    const movement = await this.prisma.inventoryMovement.create({
      data: {
        productId: dto.productId,
        type,
        quantity: dto.quantity,
        reason: dto.reason,
        reference: dto.reference,
      },
    });

    return { movement, newStock };
  }
}