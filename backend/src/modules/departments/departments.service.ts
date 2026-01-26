import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto) {
    const dept = this.repo.create(dto);
    return this.repo.save(dept);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: string, attrs: Partial<Department>) {
    const dept = await this.repo.findOneBy({ id });
    if (!dept) throw new NotFoundException('Department not found');
    Object.assign(dept, attrs);
    return this.repo.save(dept);
  }

  async remove(id: string) {
    const dept = await this.repo.findOneBy({ id });
    if (!dept) throw new NotFoundException('Department not found');
    return this.repo.remove(dept);
  }
}