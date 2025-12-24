import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  role?: string;
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare street: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare postalCode: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare country: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'user' })
  declare role: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isActive: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare refreshToken: string;
}
