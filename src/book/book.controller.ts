import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Books')
@ApiBearerAuth()
@Controller(['books', 'book'])
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Menambahkan buku (admin atau petugas)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'petugas')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Menampilkan seluruh data buku' })
  findAll() {
    return this.bookService.findAll();
  }

  @Get('judul/:title')
  findOneByTitle(@Param('title') title: string) {
    return this.bookService.findOneByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'petugas')
  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui data buku (admin atau petugas)' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'petugas')
  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus buku (admin atau petugas)' })
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
