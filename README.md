# Kanban API - Backend Sênior

## Descrição

Esta é uma API RESTful desenvolvida com Node.js e TypeScript para gerenciar projetos e tarefas em um sistema de quadro Kanban.

## Tecnologias Utilizadas

- **Framework**: NestJS
- **Banco de Dados**: PostgreSQL + Prisma
- **Autenticação**: JWT
- **Validação**: Class-validator
- **Testes**: Jest
- **Documentação**: Swagger
- **Logger**: Winston
- **Arquitetura**: Clean Architecture
- **Controle de Acesso**: RBAC (Role-Based Access Control)
- **Containerização**: Docker
- **CI/CD**: GitHub Actions

## Funcionalidades

- CRUD completo para Usuário, Projeto e Tarefa
- Autenticação via JWT
- Implementação de RBAC (controle de acesso baseado em papéis)
- Paginação nas listagens
- Filtragem de tarefas por status e projetos
- Endpoint para mover uma tarefa entre projetos
- Validação de dados
- Testes automatizados
- Registro de logs estruturados
- Tratamento global de erros
- Documentação com Swagger
- Migrações para o banco de dados
- CI/CD e deploy na nuvem

## Estrutura do Projeto

```
kanban-api/
│── src/
│   ├── application/
│   │   ├── use-cases/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeders/
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   ├── security/
│   │   ├── logging/
│   ├── tests/
│── docs/
│── .env
│── .gitignore
│── package.json
│── tsconfig.json
│── README.md

```

## Rotas da API

### Autenticação

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

### Usuários

- `GET /users` - Listar usuários (paginação)
- `GET /users/:id` - Obter detalhes de um usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário

### Projetos

- `POST /projects` - Criar um projeto
- `GET /projects` - Listar projetos (paginação e filtros)
- `GET /projects/:id` - Obter detalhes de um projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Remover projeto

### Tarefas

- `POST /tasks` - Criar uma tarefa
- `GET /tasks` - Listar tarefas (paginação e filtros)
- `GET /tasks/:id` - Obter detalhes de uma tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `PATCH /tasks/:id/move` - Mover tarefa entre projetos
- `DELETE /tasks/:id` - Remover tarefa

## Como Executar

Para rodar a aplicação:

```sh
npm run start
```

Para rodar os testes automatizados:

```sh
npm run test
```

Para rodar os testes de integração:

```sh
npm run test:integration
```

Para verificar a cobertura dos testes:

```sh
npm run test:coverage
```
