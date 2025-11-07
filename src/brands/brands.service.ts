import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand) private brandModel: typeof Brand) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = await this.brandModel.create({
        name: createBrandDto.name,
      });
      return brand;
    } catch (err) {
      // handle unique constraint or validation errors
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(err.message || 'Failed to create brand');
    }
  }

  async findAll() {
    return this.brandModel.findAll();
  }

  async findOne(id: number) {
    const brand = await this.brandModel.findByPk(id);
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    await brand.update(updateBrandDto);
    return brand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await brand.destroy();
    return { deleted: true };
  }
}
