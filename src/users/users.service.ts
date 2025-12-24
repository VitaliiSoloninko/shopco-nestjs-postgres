import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword as User;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] }, // Exclude password from result
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] }, // Exclude password from result
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      // Include password for authentication
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      // Handle null values for refreshToken separately
      if (
        'refreshToken' in updateUserDto &&
        updateUserDto.refreshToken === null
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await user.update({ refreshToken: null } as any);
        // Remove refreshToken from updateUserDto to avoid type conflict
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { refreshToken: _, ...rest } = updateUserDto;
        if (Object.keys(rest).length > 0) {
          await user.update(rest);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await user.update(updateUserDto as any);
      }

      // Return updated user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword as User;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.destroy();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword as User;
    }

    return null;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await user.update({ password: hashedNewPassword });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as User;
  }
}
