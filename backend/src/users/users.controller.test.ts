import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    create: jest.Mock;
    updateCharacter: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      updateCharacter: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('delega o cadastro para o UsersService', async () => {
    const dto = {
      name: 'Peter Parker',
      email: 'peter@heroforce.dev',
      password: 'segredo123',
    };
    usersService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);

    expect(result).toMatchObject({ id: 1 });
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('delega a troca de heroi para o UsersService', async () => {
    usersService.updateCharacter.mockResolvedValue({ id: 1, character: 'iron-man' });

    const result = await controller.updateMe(
      { user: { userId: '1' } },
      { character: 'iron-man' },
    );

    expect(result).toMatchObject({ character: 'iron-man' });
    expect(usersService.updateCharacter).toHaveBeenCalledWith(1, 'iron-man');
  });
});
