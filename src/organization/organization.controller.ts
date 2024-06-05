import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
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
@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'La organización ha sido creada ha sido creado',
  })
  @UseGuards(AuthGuard)
  create(@Body() organization: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(organization);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: number,
    @Body() organization: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.update(id, organization);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.organizationService.remove(id);
  }
}
