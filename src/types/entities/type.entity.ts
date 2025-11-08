import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { BrandType } from '../../brand-types/entities/brand-type.entity';
import { Brand } from '../../brands/entities/brand.entity';

export interface TypeAttributes {
  id: number;
  name: string;
}

export interface TypeCreationAttributes {
  name: string;
}

@Table({ tableName: 'types', timestamps: true })
export class Type extends Model<TypeAttributes, TypeCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @BelongsToMany(() => Brand, () => BrandType)
  declare brands: Brand[];
}
