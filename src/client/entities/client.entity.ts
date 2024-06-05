import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 200 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  documentType: string;

  @Column({ type: 'varchar', nullable: false, length: 40 })
  documentNumber: string;

  @Column({ type: 'varchar', nullable: false, length: 400 })
  address: string;

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
