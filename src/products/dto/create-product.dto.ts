import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product price in decimal format',
    example: 999.99,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Product rating from 0 to 5',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    default: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating?: number = 0;

  @ApiProperty({
    description: 'Product image filename',
    example: 'iphone15pro.jpg',
  })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiPropertyOptional({
    description: 'Old price for discount calculation',
    example: 1199.99,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  oldPrice?: number;

  @ApiPropertyOptional({
    description: 'Discount percentage from 0 to 100',
    example: 15,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @ApiProperty({
    description: 'Type ID reference',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  typeId: number;

  @ApiProperty({
    description: 'Brand ID reference',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  brandId: number;
}
