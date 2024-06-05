import { IsInt, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateFactureDetailDto } from 'src/facture-detail/dto/update-facture-detail.dto';

export class UpdateFactureDto {
  @IsInt()
  @IsOptional()
  clientId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFactureDetailDto)
  details: UpdateFactureDetailDto[];
}
