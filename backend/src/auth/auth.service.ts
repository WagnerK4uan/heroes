import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    // O serviço de usuários, para buscar quem está tentando logar.
    private readonly usersService: UsersService,
    // A fábrica de tokens, para emitir o crachá no fim.
    private readonly jwtService: JwtService,
  ) {}

  // TRABALHO 1: validar as credenciais e, se ok, devolver o crachá.
  async login(email: string, password: string) {
    // Busca o usuário pelo email.
    const user = await this.usersService.findByEmail(email);

    // Se não existe usuário com esse email, recusamos. Repare que damos
    // uma mensagem genérica de propósito: não dizemos "email não existe",
    // porque isso ajudaria um atacante a descobrir quais emails estão
    // cadastrados. Dizemos só "credenciais inválidas".
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Compara a senha digitada com o hash guardado. bcrypt.compare
    // embaralha a senha digitada e vê se bate com o hash salvo, SEM
    // nunca desembaralhar nada (isso é impossível por design).
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // TRABALHO 2: as credenciais batem. Montamos o "conteúdo" do crachá
    // (chamado de payload). Colocamos só o essencial para identificar o
    // usuário depois: o id, o email e o papel. NUNCA colocamos a senha
    // aqui, pois o conteúdo do JWT é legível por qualquer um que o tenha.
    const payload = {
      sub: user.id, // 'sub' (subject) é a convenção para o id do dono do token
      email: user.email,
      role: user.role,
    };

    // Assina o crachá com a chave secreta e o devolve.
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
