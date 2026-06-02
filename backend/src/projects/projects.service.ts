import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    await this.ensureResponsibleExists(createProjectDto.responsibleId);

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  findAll(filter: FilterProjectsDto = {}): Promise<Project[]> {
    const where: FindOptionsWhere<Project> = {};

    if (filter.status !== undefined) {
      where.status = filter.status;
    }

    if (filter.responsibleId !== undefined) {
      where.responsibleId = filter.responsibleId;
    }

    return this.projectRepository.find({
      where,
      relations: { responsible: true },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { responsible: true },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.responsibleId !== undefined) {
      await this.ensureResponsibleExists(updateProjectDto.responsibleId);
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  private async ensureResponsibleExists(responsibleId: number): Promise<void> {
    const responsible = await this.userRepository.findOne({
      where: { id: responsibleId },
    });

    if (!responsible) {
      throw new NotFoundException('Herói responsável não encontrado.');
    }
  }
}
