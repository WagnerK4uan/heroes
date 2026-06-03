import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Peter Parker', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'peter@heroforce.dev' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'segredo123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'spider-man' })
  @IsOptional()
  @IsString()
  character?: string;
}
