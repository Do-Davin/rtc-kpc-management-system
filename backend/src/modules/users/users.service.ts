import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // --- 1. CREATE ---
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Cast 'role' to UserRole to satisfy TypeScript
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role as UserRole, 
    });

    return this.usersRepository.save(newUser);
  }

  // --- 2. READ ALL ---
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // --- 3. FIND ONE (By ID) ---
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // --- 4. FIND BY EMAIL (Login Helper) ---
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // --- 5. AUTH METHODS (Required by AuthService) ---
  
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'fullName', 'studentId', 'department', 'year', 'refreshTokenHash'],
    });
  }

  async findByIdWithRefreshTokenHash(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'refreshTokenHash', 'role'],
    });
  }

  async updateRefreshTokenHash(userId: string, hash: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshTokenHash: hash });
  }

  async clearRefreshTokenHash(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshTokenHash: null });
  }

  // --- 6. UPDATE (FIXED ERROR HERE) ---
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 1. Hash password if it is being updated
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // 2. FIX: Cast the object to 'any' to stop TypeScript from crying about Enum vs String
    // This tells TypeScript "I know what I'm doing, just pass the data."
    const updateData = { ...updateUserDto } as any;

    await this.usersRepository.update(id, updateData);
    
    // Return the updated user
    return this.findOne(id);
  }

  // --- 7. DELETE ---
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}