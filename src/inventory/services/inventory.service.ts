import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InventoryMovementDto } from '../dtos/InventoryMovementDto';
import { InventoryMovementType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) { }

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

  async inventoryLog(page: number = 1, limit: number = 10, type?: 'IN' | 'OUT' | 'ADJUSTMENT') {
    const [movements, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where: type ? { type } : undefined,
        include: {
          product: {
            select: {
              name: true,
            }
          }
        }
      }),
      this.prisma.inventoryMovement.count({
        where: type ? { type } : undefined,
      }),
    ]);
    return {
      data: movements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
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

    const previousStock = product.stock;

    let newStock: number;

    if (type === InventoryMovementType.IN) {
      newStock = previousStock + dto.quantity;
    } else if (type === InventoryMovementType.OUT) {
      if (previousStock < dto.quantity) {
        throw new BadRequestException('Stock insuficiente');
      }
      newStock = previousStock - dto.quantity;
    } else {
      newStock = dto.quantity;
    }

    // update product
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stock: newStock },
    });

    // create movement
    const movement = await this.prisma.inventoryMovement.create({
      data: {
        productId: dto.productId,
        type,
        quantity: dto.quantity,
        previusStock: previousStock,
        newStock,
        reason: dto.reason,
        reference: dto.reference,
      },
    });

    return { movement, newStock };

  }
}