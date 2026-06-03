import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';

@ApiTags('projects')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Cria um novo projeto (apenas admin)' })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  @ApiResponse({ status: 403, description: 'Acesso restrito a administradores.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os projetos com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de projetos.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  findAll(@Query() filter: FilterProjectsDto) {
    return this.projectsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um projeto pelo id' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  @ApiResponse({ status: 404, description: 'Projeto nao encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualiza um projeto (apenas admin)' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  @ApiResponse({ status: 403, description: 'Acesso restrito a administradores.' })
  @ApiResponse({ status: 404, description: 'Projeto nao encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove um projeto (apenas admin)' })
  @ApiResponse({ status: 200, description: 'Projeto removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  @ApiResponse({ status: 403, description: 'Acesso restrito a administradores.' })
  @ApiResponse({ status: 404, description: 'Projeto nao encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
