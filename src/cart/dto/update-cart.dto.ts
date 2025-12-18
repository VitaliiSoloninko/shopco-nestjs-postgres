import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item (min: 1, max: 99)',
    example: 5,
    minimum: 1,
    maximum: 99,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
