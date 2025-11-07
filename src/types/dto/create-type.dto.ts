import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({ example: 'Casual', description: 'Type name' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
