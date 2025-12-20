import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productImage?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  selectedSize: string;

  @ApiProperty()
  selectedColor?: string;

  @ApiProperty()
  subtotal: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  tax: number;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
