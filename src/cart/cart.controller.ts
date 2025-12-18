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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({
    summary: 'Add product to cart',
    description:
      'Adds a product to the user cart. If the same product with the same size and color already exists, the quantity will be increased.',
  })
  @ApiQuery({
    name: 'deliveryFee',
    required: false,
    type: Number,
    description: 'Delivery fee for total calculation (default: 0)',
  })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid product or quantity',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addToCart(
    @GetUser('id') userId: number,
    @Body() addToCartDto: AddToCartDto,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(userId, addToCartDto, deliveryFee || 0);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user cart',
    description:
      'Returns the current user cart with all items and calculated summary (subtotal, discount, delivery fee, total)',
  })
  @ApiQuery({
    name: 'deliveryFee',
    required: false,
    type: Number,
    description: 'Delivery fee for total calculation (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
  async getCart(
    @GetUser('id') userId: number,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.getCart(userId, deliveryFee || 0);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Updates the quantity of a specific cart item. Max quantity is 99.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Cart item ID',
  })
  @ApiQuery({
    name: 'deliveryFee',
    required: false,
    type: Number,
    description: 'Delivery fee for total calculation (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item quantity updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid quantity (min: 1, max: 99)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
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
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Removes a specific item from the user cart',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Cart item ID',
  })
  @ApiQuery({
    name: 'deliveryFee',
    required: false,
    type: Number,
    description: 'Delivery fee for total calculation (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item removed successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Query('deliveryFee') deliveryFee?: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeItem(userId, itemId, deliveryFee || 0);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Clear cart',
    description: 'Removes all items from the user cart',
  })
  @ApiResponse({
    status: 204,
    description: 'Cart cleared successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid JWT token' })
  async clearCart(@GetUser('id') userId: number): Promise<void> {
    return this.cartService.clearCart(userId);
  }
}
