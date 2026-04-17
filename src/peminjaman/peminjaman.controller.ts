import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('peminjaman')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Post()
  @Roles('admin', 'petugas')
  create(@Body() dto: CreatePeminjamanDto) {
    return this.peminjamanService.create(dto);
  }

  @Get()
  @Roles('admin', 'petugas')
  findAll() {
    return this.peminjamanService.findAll();
  }

  @Patch(':id')
  @Roles('admin', 'petugas')
  returnBook(@Param('id') id: string) {
    return this.peminjamanService.returnBook(Number(id));
  }
}
