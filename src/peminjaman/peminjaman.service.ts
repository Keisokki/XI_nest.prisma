import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePeminjamanDto) {
    return this.prisma.loan.create({
      data: {
        studentId: dto.studentId,
        bookId: dto.bookId,
        loanDate: dto.loanDate,
        returnDate: dto.returnDate,
      },
    });
  }

  async findAll() {
    return this.prisma.loan.findMany({
      orderBy: { id: 'desc' },
      include: { student: true, book: true },
    });
  }

  private async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { student: true, book: true },
    });
    if (!loan) throw new NotFoundException('Peminjaman not found');
    return loan;
  }

  async returnBook(id: number) {
    await this.findOne(id);
    return this.prisma.loan.update({
      where: { id },
      data: {
        returnDate: new Date(),
      },
    });
  }
}
