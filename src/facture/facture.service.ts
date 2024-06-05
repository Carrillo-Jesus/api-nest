import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Facture } from './entities/facture.entity';
import { ClientService } from '../client/client.service';
import { FactureDetailService } from '../facture-detail/facture-detail.service';
import { FactureResponseDto } from './dto/facture-response.dto';
import { FactureDetail } from 'src/facture-detail/entities/facture-detail.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { OrganizationService } from './../organization/organization.service';
import { FactureDetailMostItemsDto } from 'src/facture-detail/dto/facture-detail-most-items.dto';
import { FactureDetailHighestTotalsDto } from 'src/facture-detail/dto/facture-detail-highest-totals.dto';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,
    private readonly clientService: ClientService,
    private readonly factureDetailService: FactureDetailService,
    private readonly organizationService: OrganizationService,
    private dataSource: DataSource,
  ) {}

  async create(createFactureDto: CreateFactureDto): Promise<string> {
    const client = await this.clientService.findOne(createFactureDto.clientId);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Verifica si hay detalles repetidos con el mismo articleId
    const articleIds = createFactureDto.details.map(
      (detail) => detail.articleId,
    );
    const duplicates = articleIds.filter(
      (id, index) => articleIds.indexOf(id) !== index,
    );
    if (duplicates.length > 0) {
      throw new BadRequestException(
        'There are two or more details with the same article ID',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const currentDate = new Date();
      const facture = this.factureRepository.create({
        date: currentDate,
        expiredDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        clientId: createFactureDto.clientId,
      });

      const savedFacture = await queryRunner.manager.save(facture);

      for (const detail of createFactureDto.details) {
        await this.factureDetailService.createDetails(
          {
            factureId: savedFacture.id,
            articleId: detail.articleId,
            numberItems: detail.numberItems,
          },
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
      return 'Facture created successfully';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<FactureResponseDto[]> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [factures, totalCount] = await this.factureRepository.findAndCount({
      take: limit,
      skip,
      relations: ['details'],
    });
    const organization = await this.organizationService.getFirstOrganization();
    const promises = factures.map(async (facture) => {
      const grandTotal = this.calculateGrandTotal(facture.details);
      const grandTotalWithDiscount = this.calculateGrandTotalWithDiscount(
        facture.details,
      );
      const client = await this.clientService.findOne(facture.clientId);

      return {
        id: facture.id,
        date: facture.date,
        expiredDate: facture.expiredDate,
        clientId: facture.clientId,
        client,
        grandTotal,
        grandTotalWithDiscount,
        totalCount,
        organization,
        details: facture.details.map((detail) => ({
          id: detail.id,
          factureId: detail.factureId,
          articleId: detail.articleId,
          numberItems: detail.numberItems,
          discount: detail.discount,
          detailTotal: detail.detailTotal,
          totalDetailWithDiscount:
            this.calculateTotalDetailWithDiscount(detail),
        })),
      };
    });
    const factureResponseDtos = await Promise.all(promises);

    return factureResponseDtos;
  }

  async findOne(id: number): Promise<FactureResponseDto> {
    const facture = await this.factureRepository.findOne({
      where: { id },
      relations: ['details'],
    });

    if (!facture) {
      throw new NotFoundException('Facture not found');
    }

    const grandTotal = this.calculateGrandTotal(facture.details);
    const grandTotalWithDiscount = this.calculateGrandTotalWithDiscount(
      facture.details,
    );

    const organization = await this.organizationService.getFirstOrganization();

    const client = await this.clientService.findOne(facture.clientId);

    const factureResponseDto: FactureResponseDto = {
      id: facture.id,
      date: facture.date,
      expiredDate: facture.expiredDate,
      clientId: facture.clientId,
      grandTotal,
      client,
      grandTotalWithDiscount,
      organization,
      details: facture.details.map((detail) => ({
        id: detail.id,
        factureId: detail.factureId,
        articleId: detail.articleId,
        numberItems: detail.numberItems,
        discount: detail.discount,
        detailTotal: detail.detailTotal,
        totalDetailWithDiscount: this.calculateTotalDetailWithDiscount(detail),
      })),
    };

    return factureResponseDto;
  }

  async updateFacture(
    id: number,
    updateFactureDto: UpdateFactureDto,
  ): Promise<string> {
    const facture = await this.factureRepository.findOne({
      where: { id },
      relations: ['details'],
    });

    if (!facture) {
      throw new NotFoundException('Facture not found');
    }

    // Verifica si hay detalles repetidos con el mismo articleId
    const articleIds = updateFactureDto.details.map(
      (detail) => detail.articleId,
    );
    const duplicates = articleIds.filter(
      (id, index) => articleIds.indexOf(id) !== index,
    );
    if (duplicates.length > 0) {
      throw new BadRequestException(
        'There are two or more details with the same article ID',
      );
    }

    const existingDetailsIds = facture.details.map(
      (detail) => detail.articleId,
    );
    const newDetailsIds = updateFactureDto.details.map(
      (detail) => detail.articleId,
    );

    // Eliminar detalles que ya no existen
    const detailsToRemove = facture.details.filter(
      (detail) => !newDetailsIds.includes(detail.articleId),
    );

    await this.factureDetailService.removeFactureDetails(detailsToRemove);

    // Actualizar detalles existentes
    const detailsToUpdate = facture.details.filter((detail) =>
      newDetailsIds.includes(detail.articleId),
    );

    for (const detail of detailsToUpdate) {
      const updateDetail = updateFactureDto.details.find(
        (newDetail) => newDetail.articleId === detail.articleId,
      );
      detail.numberItems = updateDetail.numberItems;
      await this.factureDetailService.update(detail.id, detail);
    }

    // Crear nuevos detalles
    const newDetails = updateFactureDto.details.filter(
      (newDetail) => !existingDetailsIds.includes(newDetail.articleId),
    );

    for (const newDetail of newDetails) {
      await this.factureDetailService.create({
        factureId: facture.id,
        articleId: newDetail.articleId,
        numberItems: newDetail.numberItems,
      });
    }

    return 'Facture updated successfully';
  }

  async remove(id: number) {
    return this.factureRepository.softDelete(id);
  }

  async getTop5FacturesWithMostItems(): Promise<FactureDetailMostItemsDto[]> {
    const factureIds =
      await this.factureDetailService.getTop5FacturesWithMostItems();
    return factureIds;
  }

  async getTop5FacturesByAmount(): Promise<FactureDetailHighestTotalsDto[]> {
    const factureIds =
      await this.factureDetailService.getTop5FacturesByAmount();
    return factureIds;
  }

  private calculateGrandTotal(details: FactureDetail[]): number {
    const total = details.reduce(
      (total, detail) => total + detail.detailTotal,
      0,
    );
    return parseFloat(total.toFixed(3));
  }

  private calculateGrandTotalWithDiscount(details: FactureDetail[]): number {
    const total = details.reduce(
      (total, detail) => total + this.calculateTotalDetailWithDiscount(detail),
      0,
    );
    return parseFloat(total.toFixed(3));
  }

  private calculateTotalDetailWithDiscount(detail: FactureDetail): number {
    const total = parseFloat((detail.detailTotal - detail.discount).toFixed(3));
    return parseFloat(total.toFixed(3));
  }
}
