import { Module } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { PeminjamanController } from './peminjaman.controller';

@Module({
  controllers: [PeminjamanController],
  providers: [PeminjamanService],
})
export class PeminjamanModule {}
