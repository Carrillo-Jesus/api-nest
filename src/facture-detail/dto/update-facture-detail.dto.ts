import { IsInt, IsOptional } from 'class-validator';

export class UpdateFactureDetailDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  articleId: number;

  @IsInt()
  factureId: number;

  @IsInt()
  numberItems: number;
}
