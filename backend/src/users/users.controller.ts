import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario criado com sucesso.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Define ou troca o heroi do usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Heroi atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  updateMe(@Request() req, @Body() updateMeDto: UpdateMeDto) {
    return this.usersService.updateCharacter(
      Number(req.user.userId),
      updateMeDto.character,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Lista todos os usuarios (apenas admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou invalido.' })
  @ApiResponse({ status: 403, description: 'Acesso restrito a administradores.' })
  findAll() {
    return this.usersService.findAll();
  }
}
