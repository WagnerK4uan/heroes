import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([User, Project])],
  providers: [SeedService],
})
export class SeedModule {}
