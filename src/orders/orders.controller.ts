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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('User - Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new USERorder',
    description: 'Creates order from cart items and clears the cart',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all USER orders',
    description: 'Returns all orders for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@GetUser() user: User): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get USER order by ID',
    description: 'Returns specific order details',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update USER order status',
    description: 'Updates order status (admin only in production)',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(id, user.id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel USER order',
    description: 'Cancels pending order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Only pending orders can be cancelled',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.ordersService.remove(id, user.id);
  }
}
