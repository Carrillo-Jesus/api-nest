import { IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFactureDetailDto } from 'src/facture-detail/dto/create-facture-detail.dto';

export class CreateFactureDto {
  @IsInt()
  clientId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFactureDetailDto)
  details: CreateFactureDetailDto[];
}
