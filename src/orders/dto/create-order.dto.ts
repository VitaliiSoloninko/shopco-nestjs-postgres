import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'card',
    description: 'Payment method (card, paypal, cash_on_delivery)',
  })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'First name (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '123 Main Street',
    description:
      'Street address (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'City (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: '10001',
    description:
      'Postal code (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'USA',
    description: 'Country (optional, will use user profile if not provided)',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Please leave at the door',
    description: 'Delivery notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 5.99,
    description: 'Shipping cost (default: 0)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingCost?: number;

  @ApiPropertyOptional({
    example: 2.5,
    description: 'Tax amount (default: 0)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;
}
