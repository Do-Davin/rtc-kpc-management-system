import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ELibraryService } from './elibrary.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BookCategory } from './entities/book.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('e-library')
export class ELibraryController {
  constructor(private readonly eLibraryService: ELibraryService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createBookDto.cover = `/uploads/books/${file.filename}`;
    }
    return this.eLibraryService.create(createBookDto);
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @Get()
  findAll(
    @Query('category') category?: BookCategory,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.eLibraryService.search(search);
    }
    if (category) {
      return this.eLibraryService.findByCategory(category);
    }
    return this.eLibraryService.findAll();
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @Get('available')
  findAvailable() {
    return this.eLibraryService.findAvailable();
  }

  @Roles('ADMIN', 'TEACHER')
  @Get('statistics')
  getStatistics() {
    return this.eLibraryService.getStatistics();
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eLibraryService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateBookDto.cover = `/uploads/books/${file.filename}`;
    }
    return this.eLibraryService.update(id, updateBookDto);
  }

  @Roles('ADMIN')
  @Patch(':id/toggle-availability')
  toggleAvailability(@Param('id') id: string) {
    return this.eLibraryService.toggleAvailability(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eLibraryService.remove(id);
  }
}
