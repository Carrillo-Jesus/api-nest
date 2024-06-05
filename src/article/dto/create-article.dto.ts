import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsInt()
  @IsOptional()
  wholesaleNumber?: number;

  @IsInt()
  @IsOptional()
  wholesalePercentage?: number;
}
