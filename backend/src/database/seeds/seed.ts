import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('Seed');
  const context = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const seedService = context.get(SeedService);
    await seedService.run();
  } catch (error) {
    logger.error('Falha ao executar o seed.', error as Error);
    await context.close();
    process.exit(1);
  }

  await context.close();
  process.exit(0);
}

void bootstrap();
