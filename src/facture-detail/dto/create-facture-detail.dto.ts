import { IsInt, IsOptional } from 'class-validator';

export class CreateFactureDetailDto {
  @IsInt()
  articleId: number;

  @IsInt()
  @IsOptional()
  factureId?: number;

  @IsInt()
  numberItems: number;
}
