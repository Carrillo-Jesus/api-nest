import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Article } from 'src/article/entities/article.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Article, Organization])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
