import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { FactureDetail } from 'src/facture-detail/entities/facture-detail.entity';
@Entity()
export class Facture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', nullable: false })
  date: Date;

  @Column({ type: 'datetime', nullable: false })
  expiredDate: Date;

  @Column({ type: 'int', nullable: false })
  clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

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

  @OneToMany(() => FactureDetail, (detail) => detail.facture)
  details: FactureDetail[];
}
