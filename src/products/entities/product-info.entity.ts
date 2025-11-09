import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.entity';

export interface ProductInfoAttributes {
  id: number;
  title: string;
  description: string;
  productId: number;
}

export interface ProductInfoCreationAttributes {
  title: string;
  description: string;
  productId: number;
}

@Table({ tableName: 'product_info', timestamps: true })
export class ProductInfo extends Model<
  ProductInfoAttributes,
  ProductInfoCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare productId: number;

  // Associations
  @BelongsTo(() => Product)
  declare product: Product;
}
