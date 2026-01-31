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
import { AdminCoursesService } from './admin-courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/**
 * Admin Courses Controller
 * Handles course CRUD operations for administrators.
 * Admins can create, update, and delete courses.
 * Teachers can only view courses.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class AdminCoursesController {
  constructor(private readonly adminCoursesService: AdminCoursesService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/courses',
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
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCourseDto.image = `/uploads/courses/${file.filename}`;
    }
    return this.adminCoursesService.create(createCourseDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query('departmentId') departmentId?: string) {
    if (departmentId) {
      return this.adminCoursesService.findByDepartment(departmentId);
    }
    return this.adminCoursesService.findAll();
  }

  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @Get('active')
  findAllActive() {
    return this.adminCoursesService.findAllActive();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminCoursesService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/courses',
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
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCourseDto.image = `/uploads/courses/${file.filename}`;
    }
    return this.adminCoursesService.update(id, updateCourseDto);
  }

  @Roles('ADMIN')
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.adminCoursesService.toggleStatus(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminCoursesService.remove(id);
  }
}
