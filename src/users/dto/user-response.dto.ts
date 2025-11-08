import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User unique identifier',
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  lastName: string;

  @ApiPropertyOptional({
    example: '123 Main Street',
    description: 'User street address',
  })
  street?: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'User city',
  })
  city?: string;

  @ApiPropertyOptional({
    example: '10001',
    description: 'User postal code',
  })
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'USA',
    description: 'User country',
  })
  country?: string;

  @ApiProperty({
    example: 'user',
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    example: false,
    description:
      'User active status (false by default, requires email activation)',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2023-11-08T10:00:00.000Z',
    description: 'User creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-11-08T10:00:00.000Z',
    description: 'User last update timestamp',
  })
  updatedAt: Date;
}
