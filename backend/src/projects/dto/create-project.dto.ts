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
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  agilidade?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  encantamento?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  eficiencia?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  excelencia?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  transparencia?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ambicao?: number;

  @IsInt()
  responsibleId!: number;
}
