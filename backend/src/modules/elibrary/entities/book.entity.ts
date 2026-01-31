import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  cover: string;

  @Column({ nullable: true })
  year: string;

  @Column({ type: 'int', nullable: true })
  pages: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  bookUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
