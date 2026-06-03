import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

const mockedCompare = bcrypt.compare as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna access_token quando as credenciais sao validas', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'peter@heroforce.dev',
      password: 'hashed',
      role: 'hero',
    });
    mockedCompare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token-123');

    const result = await service.login('peter@heroforce.dev', 'segredo123');

    expect(result).toEqual({ access_token: 'token-123' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'peter@heroforce.dev',
      role: 'hero',
    });
  });

  it('lanca UnauthorizedException quando o e-mail nao existe', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('ninguem@heroforce.dev', 'segredo123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('lanca UnauthorizedException quando a senha esta incorreta', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'peter@heroforce.dev',
      password: 'hashed',
      role: 'hero',
    });
    mockedCompare.mockResolvedValue(false);

    await expect(
      service.login('peter@heroforce.dev', 'errada'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
