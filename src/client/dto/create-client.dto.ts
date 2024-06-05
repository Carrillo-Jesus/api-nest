import { IsString, Length } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(1, 200)
  name: string;

  @IsString()
  @Length(1, 10)
  documentType: string;

  @IsString()
  @Length(1, 40)
  documentNumber: string;

  @IsString()
  @Length(1, 400)
  address: string;
}
