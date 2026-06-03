import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({ example: 'iron-man' })
  @IsString()
  @IsNotEmpty()
  character!: string;
}
