/*
  Warnings:

  - Made the column `newStock` on table `InventoryMovement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `previusStock` on table `InventoryMovement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `InventoryMovement` MODIFY `newStock` INTEGER NOT NULL,
    MODIFY `previusStock` INTEGER NOT NULL;
