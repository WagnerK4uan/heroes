import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Traz o UsersModule para cá. Como ele EXPORTA o UsersService,
    // o nosso AuthService poderá usá-lo para buscar usuários por email.
    UsersModule,

    // Configura a fábrica de tokens. Usamos registerAsync porque
    // precisamos pegar o JWT_SECRET do .env (lido pelo ConfigService).
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // A chave secreta que assina e valida os crachás. É a mesma
        // que você pôs no .env. Se ela vazar, qualquer um forja crachás.
        secret: config.get<string>('JWT_SECRET'),
        // Quanto tempo o crachá vale antes de expirar. 1 dia é razoável
        // para um app assim. Depois disso, o usuário precisa logar de novo.
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
