import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreatePeminjamanDto) {
    // 1. CEK STATUS BUKU: Apakah buku ini sedang dipinjam oleh siswa lain?
    const isBookBorrowed = await this.prisma.loan.findFirst({
      where: {
        bookId: dto.bookId,
        status: 'DIPINJAM', // Mencari status peminjaman yang masih aktif
      },
    });

    // 2. Jika buku masih dipinjam, lemparkan error (tolak request)
    if (isBookBorrowed) {
      throw new BadRequestException('Maaf, buku ini sedang dipinjam oleh siswa lain dan belum dikembalikan.');
    }

    // 3. Jika aman (tidak ada yang pinjam), buat peminjaman baru
    return this.prisma.loan.create({
      data: {
        studentId: dto.studentId,
        bookId: dto.bookId,
        loanDate: dto.loanDate,
        returnDate: dto.returnDate,
        status: 'DIPINJAM', // Set status awal saat dipinjam
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
    // Pastikan data peminjaman ada
    const loan = await this.findOne(id);

    // Mencegah buku yang sudah dikembalikan, dikembalikan lagi
    if (loan.status === 'DIKEMBALIKAN') {
      throw new BadRequestException('Buku pada transaksi ini sudah dikembalikan.');
    }

    // Update status peminjaman menjadi DIKEMBALIKAN
    return this.prisma.loan.update({
      where: { id },
      data: {
        returnDate: new Date(), // Catat tanggal aktual dikembalikan
        status: 'DIKEMBALIKAN', // Ubah status agar buku bisa dipinjam orang lain lagi
      },
    });
  }
}