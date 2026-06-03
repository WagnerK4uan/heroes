import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

class LoginDto {
  @ApiProperty({ example: 'peter@heroforce.dev' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'segredo123' })
  @IsString()
  password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autentica um usuario e retorna o token JWT' })
  @ApiResponse({ status: 201, description: 'Token JWT gerado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Retorna o perfil do usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuario autenticado.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  getProfile(@Request() req) {
    return this.usersService.findPublicById(Number(req.user.userId));
  }
}
