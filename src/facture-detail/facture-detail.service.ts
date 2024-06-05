import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateFactureDetailDto } from './dto/create-facture-detail.dto';
import { UpdateFactureDetailDto } from './dto/update-facture-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { FactureDetail } from './entities/facture-detail.entity';
import { DiscountService } from './services/discount.service';
import { ArticleService } from 'src/article/article.service';
import { FactureDetailMostItemsDto } from './dto/facture-detail-most-items.dto';
import { FactureDetailHighestTotalsDto } from './dto/facture-detail-highest-totals.dto';
@Injectable()
export class FactureDetailService {
  constructor(
    @InjectRepository(FactureDetail)
    private factureDetailRepository: Repository<FactureDetail>,
    private readonly discountService: DiscountService,
    private readonly articleService: ArticleService,
  ) {}

  async create(createFactureDetailDto: CreateFactureDetailDto) {
    const article = await this.articleService.findOne(
      createFactureDetailDto.articleId,
    );
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    const discount = this.discountService.calculateDiscount(
      article,
      createFactureDetailDto.numberItems,
    );

    const detailTotal = article.value * createFactureDetailDto.numberItems;

    const factureDetail = new FactureDetail();
    factureDetail.articleId = createFactureDetailDto.articleId;
    factureDetail.discount = discount;
    factureDetail.detailTotal = detailTotal;
    factureDetail.numberItems = createFactureDetailDto.numberItems;
    factureDetail.factureId = createFactureDetailDto.factureId;

    return this.factureDetailRepository.save(factureDetail);
  }

  findAll() {
    return this.factureDetailRepository.find();
  }

  findOne(id: number) {
    return this.factureDetailRepository.findOneBy({ id });
  }

  async update(id: number, updateFactureDetailDto: UpdateFactureDetailDto) {
    const article = await this.articleService.findOne(
      updateFactureDetailDto.articleId,
    );

    if (updateFactureDetailDto.numberItems <= 0) {
      throw new BadRequestException('Number items is 0');
    }

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const factureDetail = await this.factureDetailRepository.findOneBy({ id });

    if (!factureDetail) {
      throw new NotFoundException('Facture detail not found');
    }

    const discount = this.discountService.calculateDiscount(
      article,
      updateFactureDetailDto.numberItems,
    );

    const detailTotal = article.value * updateFactureDetailDto.numberItems;

    factureDetail.discount = discount;
    factureDetail.detailTotal = detailTotal;
    factureDetail.numberItems = updateFactureDetailDto.numberItems;

    return this.factureDetailRepository.save(factureDetail);
  }

  remove(id: number) {
    return this.factureDetailRepository.softDelete(id);
  }

  async createDetails(
    createFactureDetailDto: CreateFactureDetailDto,
    queryRunner: QueryRunner,
  ): Promise<FactureDetail> {
    if (createFactureDetailDto.numberItems <= 0) {
      throw new BadRequestException('Number items is 0');
    }
    const article = await this.articleService.findOne(
      createFactureDetailDto.articleId,
    );
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const discount = this.discountService.calculateDiscount(
      article,
      createFactureDetailDto.numberItems,
    );

    const detailTotal = article.value * createFactureDetailDto.numberItems;

    const factureDetail = this.factureDetailRepository.create({
      articleId: createFactureDetailDto.articleId,
      discount,
      detailTotal,
      numberItems: createFactureDetailDto.numberItems,
      factureId: createFactureDetailDto.factureId,
    });

    return queryRunner
      ? queryRunner.manager.save(factureDetail)
      : this.factureDetailRepository.save(factureDetail);
  }

  async removeFactureDetails(factures: FactureDetail[]) {
    await this.factureDetailRepository.remove(factures);
  }

  async getTop5FacturesWithMostItems(): Promise<FactureDetailMostItemsDto[]> {
    const query = this.factureDetailRepository
      .createQueryBuilder('facture_detail')
      .select('facture_detail.factureId', 'factureId')
      .addSelect('SUM(facture_detail.numberItems)', 'totalItems')
      .groupBy('facture_detail.factureId')
      .orderBy('totalItems', 'DESC')
      .limit(5);

    const result = await query.getRawMany();

    const mappedResult: FactureDetailMostItemsDto[] = result.map((item) => ({
      factureId: parseInt(item.factureId),
      numberItems: parseInt(item.totalItems),
    }));

    return mappedResult;
  }

  async getTop5FacturesByAmount(): Promise<FactureDetailHighestTotalsDto[]> {
    const query = this.factureDetailRepository
      .createQueryBuilder('facture_detail')
      .select('facture_detail.factureId', 'factureId')
      .addSelect('SUM(facture_detail.detailTotal)', 'totalWithDiscount')
      .groupBy('facture_detail.factureId')
      .orderBy('totalWithDiscount', 'DESC')
      .limit(5);

    const result = await query.getRawMany();

    const mappedResult: FactureDetailHighestTotalsDto[] = result.map(
      (item) => ({
        factureId: parseInt(item.factureId),
        total: parseInt(item.totalWithDiscount),
      }),
    );

    return mappedResult;
  }
}
