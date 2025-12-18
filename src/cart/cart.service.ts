import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from '../brands/entities/brand.entity';
import { Product } from '../products/entities/product.entity';
import { Type } from '../types/entities/type.entity';
import {
  CartItemResponseDto,
  CartResponseDto,
  CartSummaryDto,
} from './dto/cart-response.dto';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { CartItem } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
    deliveryFee: number = 0,
  ): Promise<CartResponseDto> {
    const { productId, quantity, selectedSize, selectedColor } = addToCartDto;

    // Check if the product exists
    const product = await this.productModel.findByPk(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if the item already exists in the cart with the same parameters
    const existingItem = await this.cartItemModel.findOne({
      where: {
        userId,
        productId,
        selectedSize,
        selectedColor: selectedColor || null,
      },
    });

    if (existingItem) {
      // Increasing the quantity
      existingItem.quantity += quantity;
      if (existingItem.quantity > 99) {
        existingItem.quantity = 99;
      }
      await existingItem.save();
    } else {
      // Creating a new record
      const finalQuantity = quantity > 99 ? 99 : quantity;
      await this.cartItemModel.create({
        userId,
        productId,
        quantity: finalQuantity,
        selectedSize,
        selectedColor: selectedColor || null,
      });
    }

    return this.getCart(userId, deliveryFee);
  }

  async getCart(
    userId: number,
    deliveryFee: number = 0,
  ): Promise<CartResponseDto> {
    const cartItems = await this.cartItemModel.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          include: [Brand, Type],
        },
      ],
      order: [['addedAt', 'DESC']],
    });

    const items: CartItemResponseDto[] = cartItems.map((item) => ({
      id: item.id,
      product: item.product,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      maxQuantity: 99,
      addedAt: item.addedAt,
    }));

    const summary = this.calculateSummary(cartItems, deliveryFee);

    return { items, summary };
  }

  async updateQuantity(
    userId: number,
    itemId: number,
    updateDto: UpdateCartItemDto,
    deliveryFee: number = 0,
  ): Promise<CartResponseDto> {
    const cartItem = await this.cartItemModel.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    if (updateDto.quantity > 99) {
      throw new BadRequestException('Maximum quantity is 99');
    }

    cartItem.quantity = updateDto.quantity;
    await cartItem.save();

    return this.getCart(userId, deliveryFee);
  }

  async removeItem(
    userId: number,
    itemId: number,
    deliveryFee: number = 0,
  ): Promise<CartResponseDto> {
    const cartItem = await this.cartItemModel.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    await cartItem.destroy();

    return this.getCart(userId, deliveryFee);
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartItemModel.destroy({
      where: { userId },
    });
  }

  private calculateSummary(
    cartItems: CartItem[],
    deliveryFee: number,
  ): CartSummaryDto {
    let subtotal = 0;
    let discount = 0;

    cartItems.forEach((item) => {
      const product = item.product;
      const priceToUse = product.oldPrice || product.price;
      subtotal += priceToUse * item.quantity;

      if (product.oldPrice) {
        discount += (product.oldPrice - product.price) * item.quantity;
      }
    });

    const discountPercentage =
      subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;
    const total = subtotal - discount + deliveryFee;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      discountPercentage,
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }
}
