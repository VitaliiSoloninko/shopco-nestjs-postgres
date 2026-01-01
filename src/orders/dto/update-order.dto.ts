import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 'processing',
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ],
    description: 'Order status',
  })
  @IsOptional()
  @IsEnum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ])
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

  @ApiPropertyOptional({
    example: 'paid',
    enum: ['pending', 'paid', 'failed', 'refunded'],
    description: 'Payment status',
  })
  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}
