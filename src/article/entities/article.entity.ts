import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: false })
  value: number;

  @Column({ type: 'int', nullable: true })
  wholesaleNumber: number;

  @Column({ type: 'int', nullable: true })
  wholesalePercentage: number;

  @CreateDateColumn({
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
