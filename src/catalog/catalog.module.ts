import { Module } from '@nestjs/common';
import { CategoryController} from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProductController, CategoryController],
  providers: [CategoryService, ProductService],
})
export class CatalogModule {}