import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderItem } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Get user data
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get cart items
    const cartItems = await this.cartItemModel.findAll({
      where: { userId },
      include: [Product],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Use provided address or fallback to user profile
    const shippingAddress = {
      firstName: createOrderDto.firstName || user.firstName,
      lastName: createOrderDto.lastName || user.lastName,
      email: createOrderDto.email || user.email,
      street: createOrderDto.street || user.street,
      city: createOrderDto.city || user.city,
      postalCode: createOrderDto.postalCode || user.postalCode,
      country: createOrderDto.country || user.country,
      phone: createOrderDto.phone,
    };

    // Validate required address fields
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      throw new BadRequestException(
        'Please provide complete shipping address (street, city, postal code, country)',
      );
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const tax = createOrderDto.tax || 0;
    const shippingCost = createOrderDto.shippingCost || 0;
    const totalAmount = subtotal + tax + shippingCost;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = await this.orderModel.create({
      userId,
      orderNumber,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount,
      subtotal,
      tax,
      shippingCost,
      ...shippingAddress,
      notes: createOrderDto.notes,
    });

    // Create order items from cart
    const orderItems = await Promise.all(
      cartItems.map((cartItem) =>
        this.orderItemModel.create({
          orderId: order.id,
          productId: cartItem.productId,
          productName: cartItem.product.name,
          productImage: cartItem.product.img || undefined,
          quantity: cartItem.quantity,
          price: Number(cartItem.product.price),
          selectedSize: cartItem.selectedSize,
          selectedColor: cartItem.selectedColor || undefined,
          subtotal: Number(cartItem.product.price) * cartItem.quantity,
        }),
      ),
    );

    // Clear cart
    await this.cartItemModel.destroy({ where: { userId } });

    return this.formatOrderResponse(order, orderItems);
  }

  async findAll(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.findAll({
      where: { userId },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });

    return orders.map((order) => this.formatOrderResponse(order, order.items));
  }

  // Admin: Get all orders from all users
  async findAllForAdmin(): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.findAll({
      include: [OrderItem, User],
      order: [['createdAt', 'DESC']],
    });

    return orders.map((order) => this.formatOrderResponse(order, order.items));
  }

  async findOne(id: number, userId: number): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      where: { id, userId },
      include: [OrderItem],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrderResponse(order, order.items);
  }

  // Admin: Get any order by ID
  async findOneForAdmin(id: number): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      where: { id },
      include: [OrderItem, User],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrderResponse(order, order.items);
  }

  async update(
    id: number,
    userId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await order.update(updateOrderDto);

    const items = await this.orderItemModel.findAll({
      where: { orderId: order.id },
    });

    return this.formatOrderResponse(order, items);
  }

  // Admin: Update any order
  async updateForAdmin(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await order.update(updateOrderDto);

    const items = await this.orderItemModel.findAll({
      where: { orderId: order.id },
    });

    return this.formatOrderResponse(order, items);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const order = await this.orderModel.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow deletion of pending orders
    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    await order.update({ status: 'cancelled' });

    return { message: 'Order cancelled successfully' };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  private formatOrderResponse(
    order: Order,
    items: OrderItem[],
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shippingCost: Number(order.shippingCost),
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      street: order.street,
      city: order.city,
      postalCode: order.postalCode,
      country: order.country,
      phone: order.phone,
      notes: order.notes,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: Number(item.price),
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        subtotal: Number(item.subtotal),
      })),
      createdAt: order.createdAt as Date,
      updatedAt: order.updatedAt as Date,
    };
  }
}
