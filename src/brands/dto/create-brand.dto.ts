import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike', description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
