import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { BookModule } from './book/book.module';
import { AdminModule } from './admin/admin.module';
import { PetugasModule } from './petugas/petugas.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env',
    }),
    PrismaModule,
    StudentsModule,
    BookModule,
    AdminModule,
    PetugasModule,
    PeminjamanModule,
    AuthModule,
  ],
})
export class AppModule {}
