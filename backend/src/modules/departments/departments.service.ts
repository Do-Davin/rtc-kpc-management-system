import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) {}

  async create(dto: CreateDepartmentDto) {
    try {
      const dept = this.repo.create(dto);
      return await this.repo.save(dept);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Department already exists');
      }
      throw error;
    }
  }

 
  findAll() {
    return this.repo.find({
      relations: ['teachers'],
      order: { name: 'ASC' }
    });
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, attrs: Partial<Department>) {
    const dept = await this.findOne(id);
    if (!dept) throw new NotFoundException('Department not found');
    Object.assign(dept, attrs);
    return this.repo.save(dept);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }
}