# Kanban API

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

### Autenticação

- **Login de Usuário**: Verifica as credenciais do usuário e gera um token JWT para autenticação.
- **Registro de Usuário**: Cria uma nova conta de usuário com as informações fornecidas.

### Usuários

- **Obter Perfil do Usuário**: Recupera os detalhes do usuário autenticado usando o token de acesso.
- **Listar Usuários**: Retorna uma lista paginada de usuários.
- **Obter Detalhes de um Usuário**: Fornece informações detalhadas de um usuário específico.
- **Atualizar Usuário**: Permite a atualização das informações de um usuário.
- **Remover Usuário**: Exclui um usuário do sistema.

### Projetos

- **Criar Projeto**: Cria um novo projeto com os dados fornecidos.
- **Listar Projetos**: Retorna uma lista paginada de projetos.
- **Obter Detalhes de um Projeto**: Fornece informações detalhadas de um projeto específico.
- **Atualizar Projeto**: Permite a atualização das informações de um projeto.
- **Remover Projeto**: Exclui um projeto do sistema.
- **Adicionar Membro ao Projeto**: Adiciona um usuário como membro de um projeto.
- **Remover Membro do Projeto**: Remove um usuário de um projeto.
- **Listar Membros do Projeto**: Retorna uma lista de membros de um projeto.
- **Listar Tarefas do Projeto**: Retorna uma lista de tarefas associadas a um projeto.

### Tarefas

- **Criar Tarefa**: Cria uma nova tarefa com os dados fornecidos.
- **Listar Tarefas**: Retorna uma lista paginada e filtrada de tarefas.
- **Obter Detalhes de uma Tarefa**: Fornece informações detalhadas de uma tarefa específica.
- **Atualizar Tarefa**: Permite a atualização das informações de uma tarefa.
- **Mover Tarefa entre Projetos**: Permite mover uma tarefa de um projeto para outro.
- **Remover Tarefa**: Exclui uma tarefa do sistema.

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
│   │   ├── db/
│   │   ├── repositories/
│   │   ├── controllers/
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

- `GET /users/profile` - Obter detalher de um usuário baseado no token de acesso usado
- `GET /users` - Listar usuários (paginação)
- `GET /users/:id` - Obter detalhes de um usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário

### Projetos

- `POST /projects` - Criar um projeto
- `GET /projects` - Listar projetos (paginação)
- `GET /projects/:id` - Obter detalhes de um projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Remover projeto
- `POST /projects/:id/members` - Adicionar membro ao projeto
- `DELETE /projects/:id/members` - Remover membro do projeto
- `GET /projects/:id/members` - Listar membros do projeto
- `GET /projects/:id/tasks` - Listar tarefas do projeto

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
