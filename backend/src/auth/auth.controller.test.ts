import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };
  let usersService: { findPublicById: jest.Mock };

  beforeEach(async () => {
    authService = { login: jest.fn() };
    usersService = { findPublicById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delega o login para o AuthService', async () => {
    authService.login.mockResolvedValue({ access_token: 'token-123' });

    const result = await controller.login({
      email: 'peter@heroforce.dev',
      password: 'segredo123',
    });

    expect(result).toEqual({ access_token: 'token-123' });
    expect(authService.login).toHaveBeenCalledWith(
      'peter@heroforce.dev',
      'segredo123',
    );
  });

  it('retorna o perfil do usuario autenticado', async () => {
    usersService.findPublicById.mockResolvedValue({ id: 1 });

    const result = await controller.getProfile({ user: { userId: '1' } });

    expect(result).toEqual({ id: 1 });
    expect(usersService.findPublicById).toHaveBeenCalledWith(1);
  });
});
