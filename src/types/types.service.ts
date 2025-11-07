import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  constructor(@InjectModel(Type) private typeModel: typeof Type) {}

  async create(createTypeDto: CreateTypeDto) {
    try {
      const type = await this.typeModel.create({ name: createTypeDto.name });
      return type;
    } catch (err) {
      // handle unique constraint or validation errors
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(err.message || 'Failed to create type');
    }
  }

  async findAll() {
    return this.typeModel.findAll();
  }

  async findOne(id: number) {
    const type = await this.typeModel.findByPk(id);
    if (!type) throw new NotFoundException(`Type with id ${id} not found`);
    return type;
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.findOne(id);
    await type.update(updateTypeDto);
    return type;
  }

  async remove(id: number) {
    const type = await this.findOne(id);
    await type.destroy();
    return { deleted: true };
  }
}
