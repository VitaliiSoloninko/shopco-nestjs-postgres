import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Order, OrderItem } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, CartItem, User, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
