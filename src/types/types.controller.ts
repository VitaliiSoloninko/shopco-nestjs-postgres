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
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypesService } from './types.service';

@ApiTags('Types')
@Controller('api/types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new type' })
  @ApiResponse({ status: 201, description: 'Type created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typesService.create(createTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all types' })
  @ApiResponse({ status: 200, description: 'List of types' })
  findAll() {
    return this.typesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Type found' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  findOne(@Param('id') id: string) {
    return this.typesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Type updated successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typesService.update(+id, updateTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Type ID' })
  @ApiResponse({ status: 200, description: 'Type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Type not found' })
  remove(@Param('id') id: string) {
    return this.typesService.remove(+id);
  }
}
