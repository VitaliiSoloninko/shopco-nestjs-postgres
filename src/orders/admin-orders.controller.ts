import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Admin - Orders')
@ApiBearerAuth()
@Controller('api/admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: '[ADMIN] Get all orders from all users',
    description:
      'Returns all orders from all users. Requires admin role. Includes user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'All orders retrieved successfully',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({
    summary: '[ADMIN] Get any order by ID',
    description:
      'Returns order details for any user by order ID. Requires admin role.',
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
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderResponseDto> {
    return this.ordersService.findOneForAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '[ADMIN] Update any order',
    description:
      'Updates order status, payment status, or shipping info for any order. Requires admin role.',
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
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateForAdmin(id, updateOrderDto);
  }
}
