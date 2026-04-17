import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.admin.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: dto.role || 'admin',
      },
    });
  }

  async findAll() {
    return this.prisma.admin.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findOneByUsername(username: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    await this.findOne(id);
    const data: Prisma.AdminUpdateInput = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.admin.delete({ where: { id } });
  }
}
