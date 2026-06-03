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
        character: 'Nick Fury',
        role: 'admin',
      },
      {
        key: 'stark',
        name: 'Tony Stark',
        email: 'tony.stark@heroforce.dev',
        character: 'Homem de Ferro',
        role: 'hero',
      },
      {
        key: 'rogers',
        name: 'Steve Rogers',
        email: 'steve.rogers@heroforce.dev',
        character: 'Capitão América',
        role: 'hero',
      },
      {
        key: 'prince',
        name: 'Diana Prince',
        email: 'diana.prince@heroforce.dev',
        character: 'Mulher-Maravilha',
        role: 'hero',
      },
      {
        key: 'wayne',
        name: 'Bruce Wayne',
        email: 'bruce.wayne@heroforce.dev',
        character: 'Batman',
        role: 'hero',
      },
      {
        key: 'parker',
        name: 'Peter Parker',
        email: 'peter.parker@heroforce.dev',
        character: 'Homem-Aranha',
        role: 'hero',
      },
      {
        key: 'allen',
        name: 'Barry Allen',
        email: 'barry.allen@heroforce.dev',
        character: 'Flash',
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
        name: 'Escudo de Vibranium',
        description: 'Recuperar e reforçar o escudo perdido em batalha.',
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: heroes.rogers.id,
        metas: {
          agilidade: 60,
          encantamento: 50,
          eficiencia: 68,
          excelencia: 72,
          transparencia: 65,
          ambicao: 58,
        },
      },
      {
        name: 'Resgate em Sokovia',
        description: 'Coordenar a evacuação de civis durante o conflito.',
        status: ProjectStatus.CONCLUIDO,
        responsibleId: heroes.rogers.id,
        metas: {
          agilidade: 88,
          encantamento: 84,
          eficiencia: 90,
          excelencia: 91,
          transparencia: 86,
          ambicao: 82,
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
        name: 'Protocolo Batcaverna',
        description: 'Atualizar os sistemas de vigilância de Gotham.',
        status: ProjectStatus.PENDENTE,
        responsibleId: heroes.wayne.id,
        metas: {
          agilidade: 5,
          encantamento: 8,
          eficiencia: 12,
          excelencia: 10,
          transparencia: 6,
          ambicao: 15,
        },
      },
      {
        name: 'Caçada ao Coringa',
        description: 'Localizar e conter o vilão antes do próximo ataque.',
        status: ProjectStatus.CONCLUIDO,
        responsibleId: heroes.wayne.id,
        metas: {
          agilidade: 93,
          encantamento: 80,
          eficiencia: 89,
          excelencia: 94,
          transparencia: 78,
          ambicao: 90,
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
        name: 'Velocidade Máxima',
        description: 'Treinar o controle da Força de Aceleração.',
        status: ProjectStatus.PENDENTE,
        responsibleId: heroes.allen.id,
        metas: {
          agilidade: 18,
          encantamento: 10,
          eficiencia: 14,
          excelencia: 9,
          transparencia: 7,
          ambicao: 22,
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
