import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // Endpoint protegido: GET /auth/me
  // @UseGuards(AuthGuard('jwt')) pendura o SEGURANÇA nesta porta. O 'jwt'
  // é o nome da strategy que registramos — é assim que o guard sabe qual
  // manual consultar. Sem um crachá válido, o Nest devolve 401 antes mesmo
  // de o método rodar.
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  // @Request() nos dá acesso ao objeto da requisição. Como passamos pelo
  // guard, ele contém o "usuário autenticado" que a strategy montou no
  // validate(). Ele fica em req.user.
  getProfile(@Request() req) {
    return req.user;
  }
}
