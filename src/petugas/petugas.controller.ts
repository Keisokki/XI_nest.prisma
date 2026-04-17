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
import { PetugasService } from './petugas.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('petugas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('admin')
export class PetugasController {
  constructor(private readonly petugasService: PetugasService) {}

  @Post()
  create(@Body() dto: CreatePetugasDto) {
    return this.petugasService.create(dto);
  }

  @Get()
  findAll() {
    return this.petugasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petugasService.findOne(Number(id));
  }

  @Get('username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.petugasService.findOneByUsername(username);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePetugasDto) {
    return this.petugasService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petugasService.remove(Number(id));
  }
}
