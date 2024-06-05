import { IsEmail, IsString, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @Length(1, 200)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50)
  phone: string;

  @IsString()
  @Length(1, 40)
  documentNumber: string;

  @IsString()
  @Length(1, 400)
  address: string;
}
