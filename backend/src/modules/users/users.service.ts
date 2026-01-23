import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
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
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      select: ['id', 'refreshTokenHash'],
    });

    if (!user) return;

    user.refreshTokenHash = hash;
    await this.usersRepo.save(user);

    // await this.usersRepo.update(userId, {
    //   refreshTokenHash: hash,
    // });
  }

  async clearRefreshTokenHash(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      select: ['id', 'refreshTokenHash'],
    });

    if (!user) return;

    user.refreshTokenHash = null;
    await this.usersRepo.save(user);

    // await this.usersRepo.update(userId, {
    //   refreshTokenHash: null,
    // });
  }
}
