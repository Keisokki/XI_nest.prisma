import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, AuthRole } from './dto/login.dto';

interface AuthUser {
  id: number;
  username: string;
  password: string;
  role: AuthRole;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async findUser(
    role: AuthRole,
    username: string,
  ): Promise<AuthUser | null> {
    if (role === 'admin') {
      const admin = await this.prisma.admin.findUnique({
        where: { username },
      });
      if (!admin) return null;
      return {
        id: admin.id,
        username: admin.username,
        password: admin.password,
        role: admin.role as AuthRole,
      };
    }

    const petugas = await this.prisma.petugas.findUnique({
      where: { username },
    });
    if (!petugas) return null;
    return {
      id: petugas.id,
      username: petugas.username,
      password: petugas.password,
      role: petugas.role as AuthRole,
    };
  }

  async validateUser(dto: LoginDto): Promise<AuthUser> {
    const user = await this.findUser(dto.role, dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
