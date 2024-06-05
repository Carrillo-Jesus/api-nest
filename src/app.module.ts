import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

import { OrganizationModule } from './organization/organization.module';
import { Organization } from './organization/entities/organization.entity';

import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';

import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';

import { FactureDetailModule } from './facture-detail/facture-detail.module';
import { FactureDetail } from './facture-detail/entities/facture-detail.entity';

import { FactureModule } from './facture/facture.module';
import { Facture } from './facture/entities/facture.entity';
import { SeederModule } from './seeder/seeder.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Organization, Client, Facture, Article, FactureDetail],
      synchronize: true,
      autoLoadEntities: true,
    }),
    OrganizationModule,
    ClientModule,
    FactureModule,
    FactureDetailModule,
    ArticleModule,
    SeederModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
