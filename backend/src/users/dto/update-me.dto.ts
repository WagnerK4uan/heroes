import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @IsNotEmpty()
  character!: string;
}
