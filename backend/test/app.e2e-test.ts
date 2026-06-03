import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { User } from './../src/users/entities/user.entity';
import { Project, ProjectStatus } from './../src/projects/entities/project.entity';

describe('HeroForce (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let projectRepository: Repository<Project>;

  let adminToken: string;
  let heroToken: string;
  let adminId: number;
  let heroId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    projectRepository = moduleFixture.get<Repository<Project>>(
      getRepositoryToken(Project),
    );

    await projectRepository.query('DELETE FROM projects');
    await userRepository.query('DELETE FROM users');

    const admin = await userRepository.save(
      userRepository.create({
        name: 'Nick Fury',
        email: 'admin@heroforce.dev',
        password: await bcrypt.hash('segredo123', 10),
        role: 'admin',
      }),
    );
    adminId = admin.id;
  });

  afterAll(async () => {
    await projectRepository.query('DELETE FROM projects');
    await userRepository.query('DELETE FROM users');
    await app.close();
  });

  describe('autenticacao', () => {
    it('registra um heroi via POST /users', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Peter Parker',
          email: 'peter@heroforce.dev',
          password: 'segredo123',
        })
        .expect(201);

      heroId = response.body.id;
      expect(response.body.role).toBe('hero');
    });

    it('faz login e retorna access_token', async () => {
      const admin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@heroforce.dev', password: 'segredo123' })
        .expect(201);
      adminToken = admin.body.access_token;
      expect(adminToken).toBeDefined();

      const hero = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'peter@heroforce.dev', password: 'segredo123' })
        .expect(201);
      heroToken = hero.body.access_token;
      expect(heroToken).toBeDefined();
    });

    it('GET /auth/me retorna o usuario autenticado sem senha', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${heroToken}`)
        .expect(200);

      expect(response.body.email).toBe('peter@heroforce.dev');
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('CRUD de projetos como admin', () => {
    let projectId: number;

    it('cria um projeto (POST /projects)', async () => {
      const response = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Operacao Resgate',
          description: 'Proteger a cidade.',
          status: ProjectStatus.EM_ANDAMENTO,
          responsibleId: heroId,
        })
        .expect(201);

      projectId = response.body.id;
      expect(response.body.name).toBe('Operacao Resgate');
    });

    it('lista os projetos (GET /projects)', async () => {
      const response = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('busca um projeto por id (GET /projects/:id)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(projectId);
    });

    it('atualiza um projeto (PATCH /projects/:id)', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ProjectStatus.CONCLUIDO })
        .expect(200);

      expect(response.body.status).toBe(ProjectStatus.CONCLUIDO);
    });

    it('remove um projeto (DELETE /projects/:id)', async () => {
      await request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('restricao de admin', () => {
    it('hero nao pode criar projeto (403)', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${heroToken}`)
        .send({
          name: 'Tentativa',
          description: 'Nao autorizado.',
          responsibleId: heroId,
        })
        .expect(403);
    });

    it('hero nao pode listar usuarios (403)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${heroToken}`)
        .expect(403);
    });
  });

  describe('filtros de projetos', () => {
    beforeAll(async () => {
      await projectRepository.save([
        projectRepository.create({
          name: 'Projeto Pendente',
          description: 'Aguardando inicio.',
          status: ProjectStatus.PENDENTE,
          responsibleId: heroId,
        }),
        projectRepository.create({
          name: 'Projeto em Andamento',
          description: 'Em execucao.',
          status: ProjectStatus.EM_ANDAMENTO,
          responsibleId: adminId,
        }),
      ]);
    });

    it('filtra por status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projects?status=${ProjectStatus.PENDENTE}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(
        response.body.every(
          (p: Project) => p.status === ProjectStatus.PENDENTE,
        ),
      ).toBe(true);
    });

    it('filtra por responsibleId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projects?responsibleId=${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(
        response.body.every((p: Project) => p.responsibleId === adminId),
      ).toBe(true);
    });
  });
});
