import { PartialType } from '@nestjs/swagger';
import { CreateBrandTypeDto } from './create-brand-type.dto';

export class UpdateBrandTypeDto extends PartialType(CreateBrandTypeDto) {}
