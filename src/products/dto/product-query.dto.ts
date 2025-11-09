import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Brand ID for filtering',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  brandId?: number;

  @ApiPropertyOptional({
    description: 'Type ID for filtering',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  typeId?: number;

  @ApiPropertyOptional({
    description: 'Minimum price for filtering',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price for filtering',
    example: 2000,
  })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Search query for product name',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page for pagination',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'price',
    enum: ['name', 'price', 'rating', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
