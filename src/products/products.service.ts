import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';
import { Brand } from '../brands/entities/brand.entity';
import { Type } from '../types/entities/type.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(Brand)
    private brandModel: typeof Brand,
    @InjectModel(Type)
    private typeModel: typeof Type,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Проверяем существование Brand и Type
    await this.validateBrandAndType(
      createProductDto.brandId,
      createProductDto.typeId,
    );

    const product = await this.productModel.create({
      ...createProductDto,
      rating: createProductDto.rating || 0,
    });
    return this.findOne(product.id);
  }

  async findAll(query: ProductQueryDto = {}): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      brandId,
      typeId,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const offset = (page - 1) * limit;

    // Построение условий фильтрации
    const whereConditions: Record<string, any> = {};

    if (brandId) {
      whereConditions.brandId = brandId;
    }

    if (typeId) {
      whereConditions.typeId = typeId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.price = {};
      if (minPrice !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        whereConditions.price[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        whereConditions.price[Op.lte] = maxPrice;
      }
    }

    if (search) {
      whereConditions.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { rows: products, count: total } =
      await this.productModel.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Brand,
            attributes: ['id', 'name'],
          },
          {
            model: Type,
            attributes: ['id', 'name'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true,
      });

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          model: Brand,
          attributes: ['id', 'name'],
        },
        {
          model: Type,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Если обновляются brandId или typeId, проверяем их существование
    if (updateProductDto.brandId || updateProductDto.typeId) {
      await this.validateBrandAndType(
        updateProductDto.brandId || product.brandId,
        updateProductDto.typeId || product.typeId,
      );
    }

    await product.update(updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    // Удаляем файл изображения
    if (product.img) {
      this.deleteImageFile(product.img);
    }

    await product.destroy();
  }

  async updateImage(id: number, filename: string): Promise<Product> {
    const product = await this.findOne(id);

    // Удаляем старое изображение
    if (product.img) {
      this.deleteImageFile(product.img);
    }

    await product.update({ img: filename });
    return this.findOne(id);
  }

  // Utility methods
  private async validateBrandAndType(
    brandId: number,
    typeId: number,
  ): Promise<void> {
    const [brand, type] = await Promise.all([
      this.brandModel.findByPk(brandId),
      this.typeModel.findByPk(typeId),
    ]);

    if (!brand) {
      throw new BadRequestException(`Brand with ID ${brandId} not found`);
    }

    if (!type) {
      throw new BadRequestException(`Type with ID ${typeId} not found`);
    }
  }

  private deleteImageFile(filename: string): void {
    try {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        'products',
        filename,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }
}
