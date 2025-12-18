import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product details with brand and type relations',
    type: () => Product,
  })
  product: Product;

  @ApiProperty({
    description: 'Selected size',
    example: 'Large',
  })
  selectedSize: string;

  @ApiProperty({
    description: 'Selected color (nullable)',
    example: 'Black',
    nullable: true,
  })
  selectedColor: string | null;

  @ApiProperty({
    description: 'Quantity of the product in cart',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Maximum allowed quantity',
    example: 99,
  })
  maxQuantity: number;

  @ApiProperty({
    description: 'Date when item was added to cart',
    example: '2025-12-17T08:39:54.523Z',
  })
  addedAt: Date;
}

export class CartSummaryDto {
  @ApiProperty({
    description: 'Subtotal price (sum of all products with old prices)',
    example: 719.96,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Total discount amount',
    example: 0,
  })
  discount: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 0,
  })
  discountPercentage: number;

  @ApiProperty({
    description: 'Delivery fee',
    example: 0,
  })
  deliveryFee: number;

  @ApiProperty({
    description: 'Total amount (subtotal - discount + deliveryFee)',
    example: 719.96,
  })
  total: number;
}

export class CartResponseDto {
  @ApiProperty({
    description: 'Array of cart items',
    type: [CartItemResponseDto],
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    description: 'Cart summary with calculated totals',
    type: CartSummaryDto,
  })
  summary: CartSummaryDto;
}
