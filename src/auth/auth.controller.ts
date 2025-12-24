import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account and returns JWT tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.register(registerDto);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return only access token
    return { access_token: tokens.access_token };
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns JWT tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.login(loginDto);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return only access token
    return { access_token: tokens.access_token };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logs out user and clears refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Generates new access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.refreshTokens(user.id);

    // Set new refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return only access token
    return { access_token: tokens.access_token };
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns authenticated user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates authenticated user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: User,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Changes authenticated user password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: 409,
    description: 'Current password is incorrect',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetUser() user: User,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
