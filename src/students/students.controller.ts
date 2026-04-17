import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @Roles('admin', 'petugas')
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('nis/:nis')
  @Roles('admin', 'petugas')
  findOneByNis(@Param('nis') nis: string) {
    return this.studentsService.findOneByNis(nis);
  }

  @Get('name/:name')
  @Roles('admin', 'petugas')
  findOneByName(@Param('name') name: string) {
    return this.studentsService.findOneByName(name);
  }

  @Get(':id')
  @Roles('admin', 'petugas')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}
