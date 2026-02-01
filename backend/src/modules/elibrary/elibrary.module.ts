import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ELibraryService } from './elibrary.service';
import { ELibraryController } from './elibrary.controller';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [ELibraryController],
  providers: [ELibraryService],
  exports: [ELibraryService],
})
export class ELibraryModule {}
