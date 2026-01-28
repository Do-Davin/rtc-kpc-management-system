import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
  
    const user = this.usersRepo.create({
      email: data.email,
      password: data.password,
      role: data.role,
    });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  // Standard find by ID
  findOne(id: string) {
    return this.usersRepo.findOneBy({ id });
  }

  // Helper for Auth Service
  findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
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
    await this.usersRepo.update(userId, { refreshTokenHash: hash });
  }

  async clearRefreshTokenHash(userId: string) {
    await this.usersRepo.update(userId, { refreshTokenHash: null });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.usersRepo.remove(user);
  }
}