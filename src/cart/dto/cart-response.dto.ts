import { Product } from '../../products/entities/product.entity';

export class CartItemResponseDto {
  id: number;
  product: Product;
  selectedSize: string;
  selectedColor: string | null;
  quantity: number;
  maxQuantity: number;
  addedAt: Date;
}

export class CartSummaryDto {
  subtotal: number;
  discount: number;
  discountPercentage: number;
  deliveryFee: number;
  total: number;
}

export class CartResponseDto {
  items: CartItemResponseDto[];
  summary: CartSummaryDto;
}
