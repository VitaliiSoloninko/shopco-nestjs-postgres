import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product (min: 1, max: 99)',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Selected size of the product',
    example: 'Large',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  selectedSize: string;

  @ApiProperty({
    description: 'Selected color of the product (optional)',
    example: 'Black',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  selectedColor?: string;
}
