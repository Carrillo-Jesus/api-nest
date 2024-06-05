import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article> {
    return this.articleRepository.findOneBy({ id });
  }

  async create(article: CreateArticleDto): Promise<Article> {
    return this.articleRepository.save(article);
  }

  async update(id: number, article: UpdateArticleDto): Promise<Article> {
    await this.articleRepository.update(id, article);
    return this.articleRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.softDelete(id);
  }
}
