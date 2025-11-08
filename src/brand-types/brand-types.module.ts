import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from '../brands/entities/brand.entity';
import { Type } from '../types/entities/type.entity';
import { BrandTypesController } from './brand-types.controller';
import { BrandTypesService } from './brand-types.service';
import { BrandType } from './entities/brand-type.entity';

@Module({
  imports: [SequelizeModule.forFeature([BrandType, Brand, Type])],
  controllers: [BrandTypesController],
  providers: [BrandTypesService],
})
export class BrandTypesModule {}
