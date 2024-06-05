import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FactureDetailMostItemsDto } from 'src/facture-detail/dto/facture-detail-most-items.dto';
import { FactureDetailHighestTotalsDto } from 'src/facture-detail/dto/facture-detail-highest-totals.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
@ApiTags('invoices')
@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'factura creada',
  })
  @UseGuards(AuthGuard)
  create(@Body() createFactureDto: CreateFactureDto) {
    return this.factureService.create(createFactureDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.factureService.findAll(paginationQuery);
  }

  @Get('/top-items')
  @UseGuards(AuthGuard)
  async getTop5FacturesByItems(): Promise<FactureDetailMostItemsDto[]> {
    return this.factureService.getTop5FacturesWithMostItems();
  }

  @Get('/top-total')
  @UseGuards(AuthGuard)
  async getTop5FacturesByAmount(): Promise<FactureDetailHighestTotalsDto[]> {
    return this.factureService.getTop5FacturesByAmount();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.factureService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateFactureDto: UpdateFactureDto) {
    return this.factureService.updateFacture(+id, updateFactureDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.factureService.remove(+id);
  }
}
