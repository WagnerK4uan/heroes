import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class FilterProjectsDto {
  @ApiPropertyOptional({ enum: ProjectStatus, example: ProjectStatus.EM_ANDAMENTO })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  responsibleId?: number;
}
