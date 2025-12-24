import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user (password will be hashed in UsersService)
    const user = await this.usersService.create(registerDto);

    // Generate tokens
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    // Find user with password
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Note: Allow login even if isActive is false
    // Email verification can be implemented later

    // Generate tokens
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number): Promise<TokenResponseDto> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async validateUserRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      return null;
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      return null;
    }

    return user;
  }

  private async generateTokens(user: User): Promise<TokenResponseDto> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async validateUser(userId: number): Promise<User | null> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      return user;
    }
    return null;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.update(userId, updateProfileDto);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    return this.usersService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
