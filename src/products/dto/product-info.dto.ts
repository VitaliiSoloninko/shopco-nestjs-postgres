import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductInfoDto {
  @ApiProperty({
    description: 'Product info title',
    example: 'Display',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Product info description',
    example: '6.1-inch Super Retina XDR display',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Product ID reference',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  productId: number;
}

export class UpdateProductInfoDto {
  @ApiPropertyOptional({
    description: 'Product info title',
    example: 'Display',
  })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Product info description',
    example: '6.1-inch Super Retina XDR display',
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
