/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookCategory } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class ELibraryService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepo.create({
      ...dto,
      available: dto.available ?? true,
    });
    return this.bookRepo.save(newBook);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: BookCategory): Promise<Book[]> {
    return this.bookRepo.find({
      where: { category },
      order: { title: 'ASC' },
    });
  }

  async findAvailable(): Promise<Book[]> {
    return this.bookRepo.find({
      where: { available: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async search(query: string): Promise<Book[]> {
    return this.bookRepo
      .createQueryBuilder('book')
      .where('LOWER(book.title) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(book.author) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(book.isbn) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(book.publisher) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .orderBy('book.title', 'ASC')
      .getMany();
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    Object.assign(book, dto);

    return this.bookRepo.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
  }

  async toggleAvailability(id: string): Promise<Book> {
    const book = await this.findOne(id);
    book.available = !book.available;
    return this.bookRepo.save(book);
  }

  async getStatistics() {
    const total = await this.bookRepo.count();
    const available = await this.bookRepo.count({ where: { available: true } });
    const borrowed = total - available;

    const byCategory = await this.bookRepo
      .createQueryBuilder('book')
      .select('book.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('book.category')
      .getRawMany();

    return {
      total,
      available,
      borrowed,
      byCategory: byCategory.map((item) => ({
        category: item.category,
        count: parseInt(item.count),
      })),
    };
  }
}
