import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  // forFeature registra a entidade User NESTE módulo, tornando o
  // repositório de User disponível para o UsersService. Sem esta linha,
  // o @InjectRepository(User) falha dizendo que não encontra o repositório.
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // exports torna o UsersService visível para OUTROS módulos. Vamos
  // precisar disto em breve, quando o módulo de autenticação precisar
  // buscar usuários. Já deixamos preparado.
  exports: [UsersService],
})
export class UsersModule {}
