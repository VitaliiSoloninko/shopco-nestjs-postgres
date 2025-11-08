import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBrandTypeDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @ApiProperty({ example: 1, description: 'Type ID' })
  @IsNumber()
  @IsNotEmpty()
  typeId: number;
}
