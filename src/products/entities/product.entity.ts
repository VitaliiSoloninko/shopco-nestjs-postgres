import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Brand } from '../../brands/entities/brand.entity';
import { Type } from '../../types/entities/type.entity';

export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  rating: number;
  img?: string | null;
  oldPrice?: number | null;
  discount?: number | null;
  typeId: number;
  brandId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes {
  name: string;
  price: number;
  rating?: number;
  img?: string | null;
  oldPrice?: number | null;
  discount?: number | null;
  typeId: number;
  brandId: number;
}

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  })
  declare rating: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare img: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare oldPrice: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: { min: 0, max: 100 },
  })
  declare discount: number | null;

  @ForeignKey(() => Type)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare typeId: number;

  @ForeignKey(() => Brand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare brandId: number;

  // Associations
  @BelongsTo(() => Type)
  declare type: Type;

  @BelongsTo(() => Brand)
  declare brand: Brand;
}
