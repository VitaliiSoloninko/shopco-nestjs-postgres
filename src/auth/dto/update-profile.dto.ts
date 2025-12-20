import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName?: string;

  @ApiPropertyOptional({
    example: '123 Main Street',
    description: 'User street address',
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'User city',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: '10001',
    description: 'User postal code',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'USA',
    description: 'User country',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
