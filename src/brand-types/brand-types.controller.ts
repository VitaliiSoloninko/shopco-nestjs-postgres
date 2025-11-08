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
import { BrandTypesService } from './brand-types.service';
import { CreateBrandTypeDto } from './dto/create-brand-type.dto';
import { UpdateBrandTypeDto } from './dto/update-brand-type.dto';

@ApiTags('Brand-Types')
@Controller('brand-types')
export class BrandTypesController {
  constructor(private readonly brandTypesService: BrandTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create brand-type relationship' })
  @ApiResponse({
    status: 201,
    description: 'Relationship created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Relationship already exists' })
  create(@Body() createBrandTypeDto: CreateBrandTypeDto) {
    return this.brandTypesService.create(createBrandTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brand-type relationships' })
  @ApiResponse({ status: 200, description: 'List of relationships' })
  findAll() {
    return this.brandTypesService.findAll();
  }

  @Get('brand/:brandId')
  @ApiOperation({ summary: 'Get types by brand ID' })
  @ApiParam({ name: 'brandId', type: 'number', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Types for the brand' })
  findByBrand(@Param('brandId') brandId: string) {
    return this.brandTypesService.findByBrand(+brandId);
  }

  @Get('type/:typeId')
  @ApiOperation({ summary: 'Get brands by type ID' })
  @ApiParam({ name: 'typeId', type: 'number', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Brands for the type' })
  findByType(@Param('typeId') typeId: string) {
    return this.brandTypesService.findByType(+typeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand-type relationship by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Relationship ID' })
  @ApiResponse({ status: 200, description: 'Relationship found' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  findOne(@Param('id') id: string) {
    return this.brandTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update brand-type relationship by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'Relationship updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  update(
    @Param('id') id: string,
    @Body() updateBrandTypeDto: UpdateBrandTypeDto,
  ) {
    return this.brandTypesService.update(+id, updateBrandTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand-type relationship by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'Relationship deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  remove(@Param('id') id: string) {
    return this.brandTypesService.remove(+id);
  }
}
