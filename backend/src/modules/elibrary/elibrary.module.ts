import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElibraryService } from './elibrary.service';
import { ElibraryController } from './elibrary.controller';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [ElibraryController],
  providers: [ElibraryService],
  exports: [ElibraryService],
})
export class ElibraryModule {}
