import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/CategoryCreate.dto';
import { UpdateCategoryDto } from '../dtos/CategoryUpdate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { HasPermission } from 'src/auth/decorators/has-permission.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get("paginated")
  async getAllCategoriesPaginated(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('searchName') searchName?: string,
  ) {
    return this.categoryService.findAllPaginated(page, limit, searchName);
  }

  @Get()
  async getAllCategories(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('searchName') searchName?: string,
  ) {
    return this.categoryService.findAll(page, limit, searchName);
  }

  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('CREAR_CATEGORIAS')
  @Post()
  async createCategory(@Body() categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('EDITAR_CATEGORIAS')
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategory: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, updateCategory)
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('ELIMINAR_CATEGORIAS')
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id)
  }

}