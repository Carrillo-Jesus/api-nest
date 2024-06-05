import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findOne(id: number): Promise<Organization> {
    return this.organizationRepository.findOneBy({ id });
  }

  async create(organization: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.save(organization);
  }

  async update(
    id: number,
    organization: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.organizationRepository.update(id, organization);
    return this.organizationRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.organizationRepository.softDelete(id);
  }

  async getFirstOrganization(): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: {
        deletedAt: null,
      },
      order: {
        id: 'ASC',
      },
    });

    return organization;
  }
}
