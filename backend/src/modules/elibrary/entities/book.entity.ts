import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Define possible book categories
export enum BookCategory {
  SCIENCE = 'SCIENCE',
  MATHEMATICS = 'MATHEMATICS',
  ENGINEERING = 'ENGINEERING',
  LITERATURE = 'LITERATURE',
  HISTORY = 'HISTORY',
  ARTS = 'ARTS',
  BUSINESS = 'BUSINESS',
  TECHNOLOGY = 'TECHNOLOGY',
  MEDICINE = 'MEDICINE',
  LAW = 'LAW',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('int')
  year: number;

  @Column({ nullable: true })
  cover: string;

  @Column({
    type: 'enum',
    enum: BookCategory,
    default: BookCategory.OTHER,
  })
  category: BookCategory;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ type: 'int', nullable: true })
  pages: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
