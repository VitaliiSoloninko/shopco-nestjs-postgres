import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
