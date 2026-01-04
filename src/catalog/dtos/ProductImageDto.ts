import { IsString, IsUrl } from 'class-validator';

export class ProductImageDto {
  @IsString()
  @IsUrl()
  url: string;
}