import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user (password will be hashed in UsersService)
    const user = await this.usersService.create(registerDto);

    // Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
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

    // Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }

  async validateUser(userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      return user;
    }
    return null;
  }
}
