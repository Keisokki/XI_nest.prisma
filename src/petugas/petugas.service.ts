import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PetugasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePetugasDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.petugas.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: dto.role || 'petugas',
      },
    });
  }

  async findAll() {
    return this.prisma.petugas.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const petugas = await this.prisma.petugas.findUnique({ where: { id } });
    if (!petugas) throw new NotFoundException('Petugas not found');
    return petugas;
  }

  async findOneByUsername(username: string) {
    const petugas = await this.prisma.petugas.findUnique({
      where: { username },
    });
    if (!petugas) throw new NotFoundException('Petugas not found');
    return petugas;
  }

  async update(id: number, dto: UpdatePetugasDto) {
    await this.findOne(id);
    const data: Prisma.PetugasUpdateInput = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.petugas.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.petugas.delete({ where: { id } });
  }
}
