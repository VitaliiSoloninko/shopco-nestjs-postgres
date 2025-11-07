import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './entities/type.entity';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

@Module({
  imports: [SequelizeModule.forFeature([Type])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
