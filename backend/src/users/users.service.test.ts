import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

jest.mock('bcrypt');

const mockedHash = bcrypt.hash as jest.Mock;

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    findOne: jest.Mock;
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('aplica hash bcrypt e nunca persiste a senha em texto puro', async () => {
      repository.findOne.mockResolvedValue(null);
      mockedHash.mockResolvedValue('hash-seguro');
      repository.create.mockImplementation((data) => data);
      repository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.create({
        name: 'Peter Parker',
        email: 'peter@heroforce.dev',
        password: 'segredo123',
      });

      expect(mockedHash).toHaveBeenCalledWith('segredo123', 10);
      expect(result.password).toBe('hash-seguro');
      expect(result.password).not.toBe('segredo123');
    });

    it('rejeita e-mail duplicado com ConflictException', async () => {
      repository.findOne.mockResolvedValue({
        id: 1,
        email: 'peter@heroforce.dev',
      });

      await expect(
        service.create({
          name: 'Peter Parker',
          email: 'peter@heroforce.dev',
          password: 'segredo123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findPublicById', () => {
    it('retorna o usuario sem a senha', async () => {
      repository.findOne.mockResolvedValue({
        id: 1,
        name: 'Peter Parker',
        email: 'peter@heroforce.dev',
        character: 'spider-man',
        role: 'hero',
      });

      const result = await service.findPublicById(1);

      expect(result).not.toHaveProperty('password');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true, email: true, character: true, role: true },
      });
    });

    it('lanca NotFoundException quando o usuario nao existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findPublicById(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateCharacter', () => {
    it('atualiza o heroi e retorna o usuario sem a senha', async () => {
      const stored = {
        id: 1,
        name: 'Peter Parker',
        email: 'peter@heroforce.dev',
        character: null,
        role: 'hero',
        password: 'hash',
      };
      repository.findOne.mockResolvedValueOnce(stored).mockResolvedValueOnce({
        id: 1,
        name: 'Peter Parker',
        email: 'peter@heroforce.dev',
        character: 'iron-man',
        role: 'hero',
      });
      repository.save.mockResolvedValue(stored);

      const result = await service.updateCharacter(1, 'iron-man');

      expect(repository.save).toHaveBeenCalled();
      expect(result.character).toBe('iron-man');
      expect(result).not.toHaveProperty('password');
    });

    it('lanca NotFoundException quando o usuario nao existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.updateCharacter(99, 'iron-man'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
