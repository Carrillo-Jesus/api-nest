import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    return this.clientRepository.findOneBy({ id });
  }

  async create(client: CreateClientDto): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async update(id: number, client: UpdateClientDto): Promise<Client> {
    await this.clientRepository.update(id, client);
    return this.clientRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.softDelete(id);
  }

  async findByName(name: string): Promise<Client> {
    return await this.clientRepository.findOneBy({ name });
  }

  async createClientDefault(): Promise<Client> {
    const defaultClient = this.clientRepository.create({
      name: 'CONSUMIDOR_FINAL',
      documentNumber: '000000000',
      address: 'SIN DIRECCION',
      documentType: 'DNI',
    });
    return defaultClient;
  }
}
