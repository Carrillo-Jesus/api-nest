import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { Facture } from '../../facture/entities/facture.entity';

@Entity()
export class FactureDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  factureId: number;

  @Column({ type: 'int', nullable: false })
  articleId: number;

  @Column({ type: 'int', nullable: false })
  numberItems: number;

  @Column({ type: 'float', precision: 10, scale: 3, nullable: false })
  discount: number;

  @Column({ type: 'float', precision: 10, scale: 3, nullable: false })
  detailTotal: number;

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

  @ManyToOne(() => Article)
  article: Article;

  @ManyToOne(() => Facture, (facture) => facture.details)
  facture: Facture;
}
