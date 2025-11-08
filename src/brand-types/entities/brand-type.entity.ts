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

export interface BrandTypeAttributes {
  id: number;
  brandId: number;
  typeId: number;
}

export interface BrandTypeCreationAttributes {
  brandId: number;
  typeId: number;
}

@Table({ tableName: 'brand_types', timestamps: false })
export class BrandType extends Model<
  BrandTypeAttributes,
  BrandTypeCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Brand)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'brand_id' })
  declare brandId: number;

  @ForeignKey(() => Type)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'type_id' })
  declare typeId: number;

  @BelongsTo(() => Brand)
  declare brand: Brand;

  @BelongsTo(() => Type)
  declare type: Type;
}
