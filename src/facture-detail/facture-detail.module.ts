import { Module } from '@nestjs/common';
import { FactureDetailService } from './facture-detail.service';
import { FactureDetailController } from './facture-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactureDetail } from './entities/facture-detail.entity';
import { DiscountService } from './services/discount.service';
import { ArticleService } from 'src/article/article.service';
import { Article } from 'src/article/entities/article.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FactureDetail, Article])],
  controllers: [FactureDetailController],
  providers: [FactureDetailService, DiscountService, ArticleService],
  exports: [FactureDetailService],
})
export class FactureDetailModule {}
