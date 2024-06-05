import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Article } from 'src/article/entities/article.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async seed() {
    await this.seedClients();
    await this.seedArticles();
    await this.seedOrganizations();
  }

  private async seedClients() {
    const clients = [
      {
        name: 'CONSUMIDOR_FINAL',
        documentType: 'ID',
        documentNumber: '123456',
        address: '123 Main St',
      },
    ];

    for (const client of clients) {
      const exists = await this.clientRepository.findOne({
        where: { documentNumber: client.documentNumber },
      });
      if (!exists) {
        await this.clientRepository.save(client);
      }
    }
  }

  private async seedArticles() {
    const articles = [
      {
        name: 'Product A',
        value: 19.99,
        wholesaleNumber: 10,
        wholesalePercentage: 15,
      },
      {
        name: 'Product B',
        value: 29.95,
        wholesaleNumber: 20,
        wholesalePercentage: 10,
      },
      {
        name: 'Product C',
        value: 15.49,
        wholesaleNumber: 30,
        wholesalePercentage: 5,
      },
      {
        name: 'Product D',
        value: 9.99,
        wholesaleNumber: 25,
        wholesalePercentage: 20,
      },
      {
        name: 'Product E',
        value: 49.99,
        wholesaleNumber: 50,
        wholesalePercentage: 8,
      },
    ];

    for (const article of articles) {
      const exists = await this.articleRepository.findOne({
        where: { name: article.name },
      });
      if (!exists) {
        await this.articleRepository.save(article);
      }
    }
  }

  private async seedOrganizations() {
    const organizations = [
      {
        name: 'Organization A',
        email: 'organization@gmail.com',
        phone: '1234567890',
        documentNumber: '123456',
        address: '123 Main St',
      },
    ];

    for (const organization of organizations) {
      const exists = await this.organizationRepository.findOne({
        where: { documentNumber: organization.documentNumber },
      });
      if (!exists) {
        await this.organizationRepository.save(organization);
      }
    }
  }
}
