import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async run(): Promise<void> {
    await this.wipe();
    const heroes = await this.seedUsers();
    await this.seedProjects(heroes);
    this.logger.log('Seed concluído com sucesso.');
  }

  private async wipe(): Promise<void> {
    await this.projectRepository.createQueryBuilder().delete().execute();
    await this.userRepository.createQueryBuilder().delete().execute();
    this.logger.log('Banco limpo (projects e users).');
  }

  private async seedUsers(): Promise<Record<string, User>> {
    const password = await bcrypt.hash('senha123', 10);

    const definitions = [
      {
        key: 'fury',
        name: 'Nick Fury',
        email: 'nick.fury@heroforce.dev',
        character: 'superman',
        role: 'admin',
      },
      {
        key: 'stark',
        name: 'Tony Stark',
        email: 'tony.stark@heroforce.dev',
        character: 'ironman',
        role: 'hero',
      },
      {
        key: 'wilson',
        name: 'Wade Wilson',
        email: 'wade.wilson@heroforce.dev',
        character: 'deadpool',
        role: 'hero',
      },
      {
        key: 'parker',
        name: 'Peter Parker',
        email: 'peter.parker@heroforce.dev',
        character: 'spiderman',
        role: 'hero',
      },
      {
        key: 'prince',
        name: 'Diana Prince',
        email: 'diana.prince@heroforce.dev',
        character: 'wonderwoman',
        role: 'hero',
      },
    ];

    const map: Record<string, User> = {};
    for (const definition of definitions) {
      const user = this.userRepository.create({
        name: definition.name,
        email: definition.email,
        character: definition.character,
        role: definition.role,
        password,
      });
      map[definition.key] = await this.userRepository.save(user);
    }

    this.logger.log(`Usuários criados: ${definitions.length}.`);
    return map;
  }

  private async seedProjects(heroes: Record<string, User>): Promise<void> {
    const definitions = [
      {
        name: 'Operação Ultron',
        description: 'Neutralizar a ameaça da inteligência artificial Ultron.',
        status: ProjectStatus.CONCLUIDO,
        responsibleId: heroes.stark.id,
        metas: {
          agilidade: 95,
          encantamento: 90,
          eficiencia: 92,
          excelencia: 96,
          transparencia: 88,
          ambicao: 94,
        },
      },
      {
        name: 'Reator Arc Limpo',
        description: 'Desenvolver energia sustentável para a Torre Stark.',
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: heroes.stark.id,
        metas: {
          agilidade: 70,
          encantamento: 65,
          eficiencia: 75,
          excelencia: 60,
          transparencia: 55,
          ambicao: 80,
        },
      },
      {
        name: 'Armadura Mark LXXXV',
        description: 'Projetar e montar a próxima geração de armadura.',
        status: ProjectStatus.PENDENTE,
        responsibleId: heroes.stark.id,
        metas: {
          agilidade: 12,
          encantamento: 9,
          eficiencia: 15,
          excelencia: 11,
          transparencia: 7,
          ambicao: 18,
        },
      },
      {
        name: 'Contrato Maximum Effort',
        description: 'Concluir o contrato de maior risco da temporada.',
        status: ProjectStatus.CONCLUIDO,
        responsibleId: heroes.wilson.id,
        metas: {
          agilidade: 92,
          encantamento: 70,
          eficiencia: 85,
          excelencia: 88,
          transparencia: 60,
          ambicao: 95,
        },
      },
      {
        name: 'Laço da Verdade',
        description: 'Modernizar os artefatos de Themyscira.',
        status: ProjectStatus.PENDENTE,
        responsibleId: heroes.prince.id,
        metas: {
          agilidade: 10,
          encantamento: 15,
          eficiencia: 5,
          excelencia: 8,
          transparencia: 12,
          ambicao: 20,
        },
      },
      {
        name: 'Defesa de Themyscira',
        description: 'Reforçar as muralhas e o treinamento das amazonas.',
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: heroes.prince.id,
        metas: {
          agilidade: 64,
          encantamento: 70,
          eficiencia: 58,
          excelencia: 62,
          transparencia: 60,
          ambicao: 66,
        },
      },
      {
        name: 'Caçada ao Cabo',
        description: 'Rastrear o alvo através da linha do tempo.',
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: heroes.wilson.id,
        metas: {
          agilidade: 72,
          encantamento: 58,
          eficiencia: 66,
          excelencia: 70,
          transparencia: 54,
          ambicao: 78,
        },
      },
      {
        name: 'Missão Mercenária',
        description: 'Preparar o esquadrão para o próximo grande contrato.',
        status: ProjectStatus.PENDENTE,
        responsibleId: heroes.wilson.id,
        metas: {
          agilidade: 16,
          encantamento: 10,
          eficiencia: 13,
          excelencia: 8,
          transparencia: 5,
          ambicao: 24,
        },
      },
      {
        name: 'Teia da Cidade',
        description: 'Mapear pontos críticos de criminalidade em Nova York.',
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: heroes.parker.id,
        metas: {
          agilidade: 75,
          encantamento: 68,
          eficiencia: 62,
          excelencia: 70,
          transparencia: 72,
          ambicao: 64,
        },
      },
      {
        name: 'Patrulha do Queens',
        description: 'Encerrar a onda de assaltos no bairro com sucesso.',
        status: ProjectStatus.CONCLUIDO,
        responsibleId: heroes.parker.id,
        metas: {
          agilidade: 90,
          encantamento: 86,
          eficiencia: 84,
          excelencia: 88,
          transparencia: 82,
          ambicao: 80,
        },
      },
    ];

    for (const definition of definitions) {
      const project = this.projectRepository.create({
        name: definition.name,
        description: definition.description,
        status: definition.status,
        responsibleId: definition.responsibleId,
        ...definition.metas,
      });
      await this.projectRepository.save(project);
    }

    this.logger.log(`Projetos criados: ${definitions.length}.`);
  }
}
