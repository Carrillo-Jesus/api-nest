import { Injectable } from '@nestjs/common';
import { Article } from 'src/article/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  calculateDiscount(article: Article, quantity: number): number {
    if (quantity > article.wholesaleNumber) {
      const discount = article.value * (article.wholesalePercentage / 100);
      return discount * quantity;
    }

    return 0;
  }
}
