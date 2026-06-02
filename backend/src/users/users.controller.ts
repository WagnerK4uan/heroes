import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// @Controller('users') define que tudo aqui responde sob o endereço /users.
@Controller('users')
export class UsersController {
  // O Nest injeta o service aqui automaticamente.
  constructor(private readonly usersService: UsersService) {}

  // @Post() combinado com o @Controller('users') cria o endpoint POST /users.
  // @Body() pega o corpo do pedido (o JSON enviado) e, como o tipo é
  // CreateUserDto, as validações que escrevemos são aplicadas aqui.
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
