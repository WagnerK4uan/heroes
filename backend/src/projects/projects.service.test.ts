import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus } from './entities/project.entity';
import { User } from '../users/entities/user.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };
  let userRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    projectRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    userRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: projectRepository },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('findAll', () => {
    it('aplica filtro por status e por responsibleId', async () => {
      projectRepository.find.mockResolvedValue([]);

      await service.findAll({
        status: ProjectStatus.EM_ANDAMENTO,
        responsibleId: 7,
      });

      expect(projectRepository.find).toHaveBeenCalledWith({
        where: { status: ProjectStatus.EM_ANDAMENTO, responsibleId: 7 },
        relations: { responsible: true },
      });
    });

    it('nao aplica filtros quando nenhum e informado', async () => {
      projectRepository.find.mockResolvedValue([]);

      await service.findAll();

      expect(projectRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: { responsible: true },
      });
    });
  });

  describe('create', () => {
    it('cria o projeto quando o responsavel existe', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1 });
      projectRepository.create.mockImplementation((data) => data);
      projectRepository.save.mockImplementation((data) =>
        Promise.resolve({ id: 10, ...data }),
      );

      const dto = {
        name: 'Operacao Resgate',
        description: 'Proteger a cidade.',
        responsibleId: 1,
      };
      const result = await service.create(dto);

      expect(result).toMatchObject(dto);
      expect(projectRepository.save).toHaveBeenCalled();
    });

    it('lanca NotFoundException quando o responsibleId nao existe', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Operacao Resgate',
          description: 'Proteger a cidade.',
          responsibleId: 999,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(projectRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('lanca NotFoundException quando o novo responsibleId nao existe', async () => {
      projectRepository.findOne.mockResolvedValue({ id: 10, responsibleId: 1 });
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(10, { responsibleId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(projectRepository.save).not.toHaveBeenCalled();
    });
  });
});
