import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ElibraryService } from './elibrary.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Configure multer storage for cover images
const coverStorage = diskStorage({
  destination: './public/covers',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `cover-${uniqueSuffix}${ext}`);
  },
});

// File filter to only allow images
const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Accept any image type - more permissive for images from various sources
  if (!file.mimetype.startsWith('image/')) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

@Controller('elibrary')
@UseGuards(JwtAuthGuard)
export class ElibraryController {
  constructor(private readonly elibraryService: ElibraryService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.elibraryService.create(createBookDto);
  }

  @Post('upload-cover')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: coverStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Return the URL path to access the uploaded file
    return {
      url: `/covers/${file.filename}`,
      filename: file.filename,
    };
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.elibraryService.findAll(search, category);
  }

  @Get('categories')
  getCategories() {
    return this.elibraryService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elibraryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.elibraryService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elibraryService.remove(id);
  }
}
