import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.usersRepo.create({
      ...dto,
      role: dto.role as 'STUDENT' | 'TEACHER' | 'ADMIN',
    });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  findOne(id: string) {
    return this.usersRepo.findOneBy({ id });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Update the user properties
    Object.assign(user, updateUserDto);
    return this.usersRepo.save(user);
  }
  findByEmailWithPassword(email: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByIdWithRefreshTokenHash(userId: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async updateRefreshTokenHash(userId: string, hash: string) {
    await this.usersRepo.update(userId, {
      refreshTokenHash: hash,
    });
  }

  async clearRefreshTokenHash(userId: string) {
    await this.usersRepo.update(userId, {
      refreshTokenHash: null,
    });
  }
}
