import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { BrandType } from '../../brand-types/entities/brand-type.entity';
import { Product } from '../../products/entities/product.entity';
import { Type } from '../../types/entities/type.entity';

export interface BrandAttributes {
  id: number;
  name: string;
}

export interface BrandCreationAttributes {
  name: string;
}

@Table({ tableName: 'brands', timestamps: true })
export class Brand extends Model<BrandAttributes, BrandCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @BelongsToMany(() => Type, () => BrandType)
  declare types: Type[];

  @HasMany(() => Product)
  declare products: Product[];
}
