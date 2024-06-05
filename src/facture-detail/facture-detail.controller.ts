import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FactureDetailService } from './facture-detail.service';
import { CreateFactureDetailDto } from './dto/create-facture-detail.dto';
import { UpdateFactureDetailDto } from './dto/update-facture-detail.dto';
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
@ApiTags('invoice details')
@Controller('facture-details')
export class FactureDetailController {
  constructor(private readonly factureDetailService: FactureDetailService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'El articulo ha sido creado',
  })
  create(@Body() createFactureDetailDto: CreateFactureDetailDto) {
    return this.factureDetailService.create(createFactureDetailDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.factureDetailService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.factureDetailService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateFactureDetailDto: UpdateFactureDetailDto,
  ) {
    return this.factureDetailService.update(+id, updateFactureDetailDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.factureDetailService.remove(+id);
  }
}
