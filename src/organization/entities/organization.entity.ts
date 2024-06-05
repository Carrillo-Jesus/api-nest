import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  documentNumber: string;

  @Column({ type: 'varchar', length: 400, nullable: false })
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
