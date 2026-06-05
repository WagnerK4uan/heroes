# 🦸 HeroForce

Portal fullstack que simula um sistema de gestão e venda de **projetos heroicos**.

Heróis (usuários) se cadastram, escolhem um personagem (Marvel, DC etc.) e visualizam seus projetos. Administradores cadastram, editam e acompanham o progresso dos projetos com base em **seis metas**. Um dashboard exibe os projetos ativos, o andamento, os responsáveis e o percentual de conclusão.

### Destaques

- **Autenticação JWT** com Passport + bcrypt
- **Controle de acesso por papel** (`admin` / `hero`)
- **Dashboard** com barra de progresso (média das 6 metas) e filtros
- **Design system** próprio com tema claro/escuro (tokens OKLCH + Tailwind)
- **Documentação interativa** da API via Swagger
- **Docker Compose** sobe a stack completa com um comando
- **Seeder** com dados de demonstração (heróis e projetos)
- **Testes** unitários e e2e

---

## 🧱 Stack

| Camada       | Tecnologias                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| **Backend**  | NestJS 11 · TypeORM · PostgreSQL 16 · JWT (Passport + bcrypt) · Swagger      |
| **Frontend** | React 18 · Vite 6 · TypeScript 5.7 · Tailwind CSS 3.4 · React Router 6 · Axios |
| **Infra**    | Docker · Docker Compose · Nginx (servindo o SPA em produção)                |

---

## 📁 Estrutura do repositório

```text
heroes/
├── backend/             # API NestJS (auth, users, projects, seeder)
│   ├── src/
│   ├── Dockerfile
│   └── .env.example
├── frontend/            # SPA React + Vite
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── docker-compose.yml   # Orquestração (db + backend + frontend)
└── CLAUDE.md            # Documentação do projeto
```

---

## ✅ Pré-requisitos

- **Node.js 22+** e **npm**
- **PostgreSQL 16** (ou apenas **Docker**, para subir o banco em container)
- **Docker** + **Docker Compose** (opcional, mas recomendado)

---

## 🚀 Rodando localmente (sem Docker)

### 1. Banco de dados

Suba um PostgreSQL local **ou** apenas o serviço de banco do compose:

```bash
docker compose up -d db
```

> ⚠️ O Postgres do compose é exposto na porta **5433** do host (mapeada para `5432` no container). Use `DB_PORT=5433` no backend se for conectar nesse banco.

### 2. Backend (API)

```bash
cd backend
cp .env.example .env      # preencha as variáveis (veja a tabela abaixo)
npm install
npm run seed              # popula 5 usuários + 10 projetos (apaga e recria os dados)
npm run start:dev         # API em http://localhost:3000
```

Variáveis do `backend/.env`:

| Variável      | Descrição                       | Exemplo (Postgres local) | Exemplo (Postgres do compose) |
| ------------- | ------------------------------- | ------------------------ | ----------------------------- |
| `DB_HOST`     | Host do PostgreSQL              | `localhost`              | `localhost`                   |
| `DB_PORT`     | Porta do PostgreSQL             | `5432`                   | `5433`                        |
| `DB_USERNAME` | Usuário do banco                | `postgres`               | `postgres`                    |
| `DB_PASSWORD` | Senha do banco                  | `postgres`               | `postgres`                    |
| `DB_DATABASE` | Nome do banco                   | `heroforce`              | `heroforce`                   |
| `JWT_SECRET`  | Segredo para assinar os tokens  | `uma-chave-secreta`      | `uma-chave-secreta`           |

> ℹ️ O TypeORM roda com `synchronize: true`, então o **schema é criado automaticamente** ao iniciar — não há migrations a executar.

### 3. Frontend (SPA)

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm install
npm run dev               # SPA em http://localhost:5173
```

Variáveis do `frontend/.env`:

| Variável                 | Obrigatória | Descrição                                                                    |
| ------------------------ | ----------- | ---------------------------------------------------------------------------- |
| `VITE_API_URL`           | ✅ Sim       | URL base da API (ex.: `http://localhost:3000`)                               |
| `VITE_SHOW_QUICK_ACCESS` | ❌ Não       | Quando `true`, exibe botões de acesso rápido (credenciais de demo) no login. |

Acesse **http://localhost:5173** no navegador. 🎉

---

## 🔑 Credenciais de demonstração (seed)

Após `npm run seed`, os seguintes usuários ficam disponíveis (senha de todos: **`senha123`**):

| Nome          | Papel   | Personagem  |
| ------------- | ------- | ----------- |
| Nick Fury     | `admin` | superman    |
| Tony Stark    | `hero`  | ironman     |
| Wade Wilson   | `hero`  | deadpool    |
| Peter Parker  | `hero`  | spiderman   |
| Diana Prince  | `hero`  | wonderwoman |

> Use **Nick Fury** para testar as funcionalidades de administrador (criar/editar/excluir projetos) e qualquer herói para ver a visão de usuário comum.

---

## 🐳 Rodando tudo com Docker Compose

A forma mais rápida de subir a stack completa:

```bash
docker compose up --build
```

| Serviço    | Imagem / Build   | Porta (host → container) | URL                     |
| ---------- | ---------------- | ------------------------ | ----------------------- |
| `db`       | `postgres:16`    | `5433 → 5432`            | —                       |
| `backend`  | `./backend`      | `3000 → 3000`            | http://localhost:3000   |
| `frontend` | `./frontend`     | `80 → 80`                | http://localhost        |

Os dados do Postgres são persistidos no volume nomeado **`db_data`**.

> ⚠️ **Sobre o seed no Docker:** a imagem de produção do backend roda `node dist/main` (sem `ts-node` nem o código-fonte), então `npm run seed` **não roda dentro do container**. Para popular o banco do compose:
> - rode `npm run seed` a partir de `backend/` (no host) apontando o `.env` para `DB_HOST=localhost` e `DB_PORT=5433`; **ou**
> - cadastre usuários normalmente pela tela de registro / `POST /users`.

---

## 📚 Documentação da API (Swagger)

Com o backend rodando, acesse: **http://localhost:3000/api**

Principais rotas:

| Método   | Rota            | Autenticação | Descrição                                                  |
| -------- | --------------- | ------------ | ---------------------------------------------------------- |
| `POST`   | `/users`        | —            | Cadastro de usuário                                        |
| `POST`   | `/auth/login`   | —            | Login (retorna o token JWT)                                |
| `GET`    | `/auth/me`      | JWT          | Dados do usuário autenticado                               |
| `PATCH`  | `/users/me`     | JWT          | Define/troca o próprio herói (personagem)                  |
| `GET`    | `/users`        | JWT (admin)  | Lista todos os usuários                                    |
| `POST`   | `/projects`     | JWT (admin)  | Cria um projeto                                            |
| `GET`    | `/projects`     | JWT          | Lista projetos (filtros por `status` e herói responsável)  |
| `GET`    | `/projects/:id` | JWT          | Detalha um projeto                                         |
| `PATCH`  | `/projects/:id` | JWT (admin)  | Edita um projeto                                           |
| `DELETE` | `/projects/:id` | JWT (admin)  | Remove um projeto                                          |

---

## 🧪 Testes

A partir de `backend/`:

```bash
npm test            # testes unitários
npm run test:cov    # cobertura
npm run test:e2e    # testes end-to-end
```

---

## ☁️ Deploy (Docker Compose em VPS)

O deploy é feito subindo a stack completa via Docker Compose em um servidor/VPS.

### 1. Preparar o servidor

Instale **Docker** e o plugin **Docker Compose** na VPS (Ubuntu/Debian):

```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Obter o código

```bash
git clone https://github.com/WagnerK4uan/heroes.git
cd heroes
git checkout deploy
```

### 3. Ajustar variáveis de produção

Antes de subir, edite o `docker-compose.yml` (ou use um `.env`/arquivo de override) e ajuste:

- **`JWT_SECRET`** — troque `change-me-in-production` por um segredo forte e aleatório.
- **Senha do Postgres** — substitua `postgres` por uma senha forte (em `db` **e** no `backend`).
- **`VITE_API_URL`** (build arg do `frontend`) — aponte para o **endereço público da API**, e não `http://localhost:3000`. Ex.: `https://api.seudominio.com`.

> 💡 O `VITE_API_URL` é injetado em **tempo de build** do frontend. Se mudar essa URL depois, é necessário reconstruir a imagem do frontend (`docker compose up -d --build frontend`).

### 4. Subir

```bash
docker compose up -d --build
docker compose logs -f
```

---

## 🗺️ Status do projeto

| Área                                   | Status |
| -------------------------------------- | ------ |
| Backend (auth, users, projects, CRUD)  | ✅      |
| Frontend (auth, dashboard, formulários)| ✅      |
| Design system + tema claro/escuro      | ✅      |
| Seeder                                 | ✅      |
| Swagger                                | ✅      |
| Docker                                 | ✅      |
| Testes automatizados                   | ✅      |
| Deploy                                 | ✅      |
| CI/CD                                  | ✅      |
