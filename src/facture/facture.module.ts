import { Module } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { ClientModule } from 'src/client/client.module';
import { FactureDetailModule } from 'src/facture-detail/facture-detail.module';
import { ArticleModule } from 'src/article/article.module';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facture]),
    ClientModule,
    FactureDetailModule,
    ArticleModule,
    OrganizationModule,
  ],
  controllers: [FactureController],
  providers: [FactureService],
})
export class FactureModule {}
