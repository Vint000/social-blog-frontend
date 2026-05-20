# Blog EducaMais — Tech Challenge Fase 03

> Plataforma educacional onde professores publicam e gerenciam posts; alunos leem e buscam conteúdo.

## Descrição

Sistema full-stack com dois perfis de usuário: **professores** autenticados criam, editam e excluem posts pelo painel admin; **alunos** acessam a área pública para ler e pesquisar conteúdo sem necessidade de login. Stack: React 19 + Vite no frontend, Node.js + Express + Prisma ORM no backend, PostgreSQL 16 como banco de dados — tudo orquestrado via Docker Compose.

---

## Arquitetura

```
┌───────────────────────────────────────────────────────────────┐
│                       docker-compose                          │
│                                                               │
│  ┌──────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │   Frontend   │─>  │    Backend    │───>│ DB (Postgres) │   │
│  │  React/Vite  │    │ Node/Express  │    │ interno:5432  │   │
│  │  host: 5173  │    │  host: 3000   │    │  host: 55432  │   │
│  └──────────────┘    └───────────────┘    └───────────────┘   │
│                            │ Prisma ORM                       │
└───────────────────────────────────────────────────────────────┘
```

Portas expostas no host:

| Serviço | Porta host | Porta interna |
|---------|-----------|---------------|
| Frontend | `5173` | `5173` |
| Backend API | `3000` | `3000` |
| PostgreSQL | `55432` | `5432` |

> A porta host do banco é **55432** (não 5432) para evitar conflito com instâncias locais de PostgreSQL.

---

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4.x, React Router v6 |
| Backend | Node.js, Express, Prisma ORM |
| Banco de dados | PostgreSQL 16 |
| Infraestrutura | Docker, Docker Compose |
| Autenticação | Header `x-user-type: teacher` (simulado) |

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Docker Compose v2)
- [Git](https://git-scm.com/)

> Node.js **não** é necessário localmente — tudo roda dentro dos containers.

---

## Setup Local

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPO>
cd blogeducamais-techchallenge-fase03

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Subir todos os serviços (primeira execução faz build e migrations)
docker compose up --build

# 4. Acessar
# Frontend: http://localhost:5173
# API:      http://localhost:3000
```

> Na primeira execução, o Prisma roda as migrations automaticamente e cria o schema do banco.

---

## Variáveis de Ambiente

| Variável | Descrição | Valor padrão |
|----------|-----------|--------------|
| `POSTGRES_USER` | Usuário do PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nome do banco de dados | `blogdb` |
| `PORT` | Porta do servidor Express | `3000` |
| `DATABASE_URL` | String de conexão Prisma (dev local sem Docker) | `postgresql://postgres:postgres@localhost:5432/blogdb` |
| `CORS_ORIGIN` | Origem permitida pelo CORS | `http://localhost:5173` |
| `VITE_API_URL` | URL da API consumida pelo frontend | `http://localhost:3000` |

> **DATABASE_URL com Docker:** ao usar `docker compose up`, o compose **sobrescreve automaticamente** `DATABASE_URL` com a string interna `@db:5432` (nome do serviço Docker). O valor no `.env` é ignorado nesse contexto — não é necessário alterar. O valor `@localhost:5432` no `.env.example` é útil apenas para quem rodar o backend fora do Docker.
>
> **VITE_API_URL:** resolvida no browser, fora da rede Docker — por isso usa `localhost:3000` e não `backend:3000`.

---

## Credenciais de Teste

| Perfil | E-mail | Senha | Acesso |
|--------|--------|-------|--------|
| Professor | `professor@escola.com` | `senha123` | `/login` → redireciona para `/admin` |
| Aluno | — | — | Área pública em `/` (sem login) |

---

## Endpoints da API

Base URL: `http://localhost:3000`

### Posts — Leitura (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/posts` | Lista todos os posts |
| `GET` | `/posts/search?q=palavra` | Busca posts por título ou conteúdo |
| `GET` | `/posts/:id` | Retorna um post pelo ID |

### Posts — Escrita (somente professor)

Requer header: `x-user-type: teacher`

| Método | Rota | Corpo | Descrição |
|--------|------|-------|-----------|
| `POST` | `/posts` | `{ title, content, author }` | Cria novo post |
| `PUT` | `/posts/:id` | `{ title?, content?, author? }` | Atualiza post (campos opcionais) |
| `DELETE` | `/posts/:id` | — | Exclui post |

### Exemplo cURL — criar post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "x-user-type: teacher" \
  -d '{"title":"Meu Post","content":"Conteúdo do post","author":"Prof. Nome"}'
```

---

## Estrutura do Projeto

```
blogeducamais-techchallenge-fase03/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── modules/posts/    # Controller, routes, validators
│   │   └── middlewares/      # requireTeacher
│   ├── prisma/               # Schema e migrations
│   └── Dockerfile
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── pages/            # HomePage, PostPage, LoginPage, AdminPage, etc.
│   │   ├── components/       # ProtectedRoute
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # useAuth
│   │   └── services/         # api.js (fetch wrapper)
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Parar os Serviços

```bash
docker compose down        # para e remove os containers
docker compose down -v     # remove também o volume do banco (dados perdidos)
```
