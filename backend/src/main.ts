import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Liga a validação automática em TODA a aplicação. A partir daqui,
  // qualquer DTO com decorators do class-validator é checado sozinho.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist remove campos que o cliente mandou mas que NÃO existem
      // no DTO. Ex.: se mandarem "role", ele é descartado em silêncio.
      // Esta é a segunda camada de defesa contra o truque do admin.
      whitelist: true,
      // forbidNonWhitelisted faz o pedido FALHAR se vier campo estranho,
      // em vez de só descartar. Mais rígido e mais transparente.
      forbidNonWhitelisted: true,
      // transform converte os dados recebidos para os tipos certos
      // automaticamente (ex.: uma string "5" vira número 5 quando o DTO pede número).
      transform: true,
    }),
  );

  // Liga o CORS. Sem isto, o frontend React (que roda numa porta diferente)
  // seria BLOQUEADO pelo navegador ao tentar conversar com o backend.
  // É uma das causas mais comuns de "por que meu front não conecta no back".
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
