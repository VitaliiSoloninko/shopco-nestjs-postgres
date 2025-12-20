import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

export interface OrderAttributes {
  id: number;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  // Shipping address
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes {
  userId: number;
  orderNumber: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  notes?: string;
}

@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare orderNumber: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

  @Column({ type: DataType.STRING, allowNull: false })
  declare paymentMethod: string;

  @Column({
    type: DataType.ENUM('pending', 'paid', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare shippingCost: number;

  // Shipping address fields
  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare street: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare postalCode: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare country: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string;

  // Relations
  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => OrderItem)
  declare items: OrderItem[];
}

// Order Items Entity
export interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor?: string;
  subtotal: number;
}

export interface OrderItemCreationAttributes {
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor?: string;
  subtotal: number;
}

@Table({ tableName: 'order_items', timestamps: false })
export class OrderItem extends Model<
  OrderItemAttributes,
  OrderItemCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare orderId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare productId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare productName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare productImage: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare selectedSize: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare selectedColor: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare subtotal: number;

  // Relations
  @BelongsTo(() => Order)
  declare order: Order;
}
