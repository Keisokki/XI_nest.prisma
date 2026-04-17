import { PartialType } from '@nestjs/mapped-types';
import { CreatePetugasDto } from './create-petugas.dto';

export class UpdatePetugasDto extends PartialType(CreatePetugasDto) {}
