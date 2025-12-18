import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

export interface CartItemAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor?: string | null;
  addedAt?: Date;
}

export interface CartItemCreationAttributes {
  userId: number;
  productId: number;
  quantity: number;
  selectedSize: string;
  selectedColor?: string | null;
}

@Table({ tableName: 'cart_items', timestamps: false })
export class CartItem extends Model<
  CartItemAttributes,
  CartItemCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare quantity: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare selectedSize: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare selectedColor: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare addedAt: Date;

  // Relations
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Product)
  declare product: Product;
}
