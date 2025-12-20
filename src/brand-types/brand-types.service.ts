import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from '../brands/entities/brand.entity';
import { Type } from '../types/entities/type.entity';
import { CreateBrandTypeDto } from './dto/create-brand-type.dto';
import { UpdateBrandTypeDto } from './dto/update-brand-type.dto';
import { BrandType } from './entities/brand-type.entity';

@Injectable()
export class BrandTypesService {
  constructor(
    @InjectModel(BrandType) private brandTypeModel: typeof BrandType,
  ) {}

  async create(createBrandTypeDto: CreateBrandTypeDto) {
    try {
      // Check if relationship already exists
      const existing = await this.brandTypeModel.findOne({
        where: {
          brandId: createBrandTypeDto.brandId,
          typeId: createBrandTypeDto.typeId,
        },
      });

      if (existing) {
        throw new ConflictException('Brand-Type relationship already exists');
      }

      const brandType = await this.brandTypeModel.create({
        brandId: createBrandTypeDto.brandId,
        typeId: createBrandTypeDto.typeId,
      });
      return brandType;
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }

      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        err.message || 'Failed to create brand-type relationship',
      );
    }
  }

  async findAll() {
    return this.brandTypeModel.findAll({
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Type, attributes: ['id', 'name'] },
      ],
    });
  }

  async findOne(id: number) {
    const brandType = await this.brandTypeModel.findByPk(id, {
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Type, attributes: ['id', 'name'] },
      ],
    });
    if (!brandType)
      throw new NotFoundException(
        `Brand-Type relationship with id ${id} not found`,
      );
    return brandType;
  }

  async update(id: number, updateBrandTypeDto: UpdateBrandTypeDto) {
    const brandType = await this.findOne(id);
    await brandType.update(updateBrandTypeDto);
    return brandType;
  }

  async remove(id: number) {
    const brandType = await this.findOne(id);
    await brandType.destroy();
    return { deleted: true };
  }

  async findByBrand(brandId: number) {
    return this.brandTypeModel.findAll({
      where: { brandId },
      include: [{ model: Type, attributes: ['id', 'name'] }],
    });
  }

  async findByType(typeId: number) {
    return this.brandTypeModel.findAll({
      where: { typeId },
      include: [{ model: Brand, attributes: ['id', 'name'] }],
    });
  }
}
