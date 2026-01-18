import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  // ------------------------ Testing ------------------------
  @Get('teacher-only')
  @Roles('TEACHER')
  teacherOnly() {
    return { message: 'Teacher access only' };
  }

  @Get('me')
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  getStudentProfile() {
    return { message: 'Authenticated user profile' };
  }

  @Get('admin-only')
  @Roles('ADMIN')
  adminOnly() {
    return { message: 'Admin access only' };
  }

  @Get(':id')
  findOneUser(@Param() id: string) {
    return this.usersService.findOne(id);
  }
}
