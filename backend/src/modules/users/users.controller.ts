import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ================= CREATE =================

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ================= ME (MUST BE FIRST) =================

  @Get('me')
  @Roles('STUDENT', 'TEACHER', 'ADMIN')
  getProfile(@Request() req: AuthRequest) {
    return {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    };
  }

  // ================= FIND ALL =================

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  // ================= FIND ONE =================

  @Get(':id')
  findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
