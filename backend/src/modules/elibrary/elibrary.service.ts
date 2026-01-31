import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class ElibraryService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(search?: string, category?: string): Promise<Book[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (category && category !== 'All') {
      queryBuilder.andWhere('book.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(book.title ILIKE :search OR book.author ILIKE :search OR book.category ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('book.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  async getCategories(): Promise<string[]> {
    const result = await this.bookRepository
      .createQueryBuilder('book')
      .select('DISTINCT book.category', 'category')
      .where('book.category IS NOT NULL')
      .getRawMany<{ category: string }>();

    return result.map((r) => r.category).filter(Boolean);
  }
}
