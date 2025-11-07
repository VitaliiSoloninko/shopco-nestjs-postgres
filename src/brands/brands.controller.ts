import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'List of brands' })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Brand found' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update brand by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
