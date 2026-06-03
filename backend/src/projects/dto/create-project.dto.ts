import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Operacao Resgate', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Proteger a cidade de uma ameaca iminente.', minLength: 2 })
  @IsString()
  @MinLength(2)
  description!: string;

  @ApiPropertyOptional({ enum: ProjectStatus, example: ProjectStatus.PENDENTE })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  agilidade?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  encantamento?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  eficiencia?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  excelencia?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  transparencia?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ambicao?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  responsibleId!: number;
}
