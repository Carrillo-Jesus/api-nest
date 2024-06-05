import { FactureDetailResponseDto } from 'src/facture-detail/dto/facture-detail-response.dto';
import { Organization } from 'src/organization/entities/organization.entity';
import { Client } from 'src/client/entities/client.entity';
export class FactureResponseDto {
  id: number;
  date: Date;
  expiredDate: Date;
  clientId: number;
  grandTotal: number;
  grandTotalWithDiscount: number;
  totalCount?: number;
  organization: Organization;
  client: Client;
  details: FactureDetailResponseDto[];
}
