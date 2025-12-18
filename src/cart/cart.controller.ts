import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @GetUser('id') userId: number,
    @Body() addToCartDto: AddToCartDto,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(userId, addToCartDto, deliveryFee || 0);
  }

  @Get()
  async getCart(
    @GetUser('id') userId: number,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.getCart(userId, deliveryFee || 0);
  }

  @Patch(':id')
  async updateQuantity(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateCartItemDto,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.updateQuantity(
      userId,
      itemId,
      updateDto,
      deliveryFee || 0,
    );
  }

  @Delete(':id')
  async removeItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeItem(userId, itemId, deliveryFee || 0);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@GetUser('id') userId: number): Promise<void> {
    return this.cartService.clearCart(userId);
  }
}
