# Kanban API

[![Deploy](https://img.shields.io/badge/Deploy-Production-green)](https://kanban-api-fbacf9bca2fc.herokuapp.com/api/v1/)
[![Develop](https://img.shields.io/badge/Deploy-Develop-yellow)](https://kanban-api-dev-e550593d618f.herokuapp.com//api/v1/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-blue)](https://kanban-api-fbacf9bca2fc.herokuapp.com/api/v1/docs)

## Descrição

Esta é uma API RESTful desenvolvida com Node.js e TypeScript para gerenciar projetos e tarefas em um sistema de quadro Kanban.

## Como rodar o projeto

Para rodar o projeto, siga os passos abaixo:

1. Rode o Docker Compose para iniciar o banco de dados:

   ```sh
   docker-compose up -d
   ```

2. Execute o script `migrate-db.sh` para aplicar as migrações no banco de dados principal e no banco de dados de testes:

linux:

```sh
./scripts/migrate-db.sh
```

windows:

```sh
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; .\run_migrations.ps1

```

3. Instale as dependências do projeto:

   ```sh
   npm install
   ```

4. Gere os arquivos do Prisma e aplique as migrações do banco de dados:

   ```sh
   npm run build
   ```

5. Inicie a aplicação em modo de desenvolvimento:

   ```sh
   npm run start:dev
   ```

6. Para iniciar a aplicação em modo de produção:

   ```sh
   npm run start:prod
   ```

7. Acesse `http://localhost:3000/api/v1/` para ver a rota de health check e verificar se está rodando

8. Acesse `http://localhost:3000/api/v1/` para ver as possíveis rotas pela documentação do swagger

## Como rodar os testes

Para rodar os testes, siga os passos abaixo:

1. Execute o script `migrate-db.sh` para aplicar as migrações no banco de dados principal e no banco de dados de testes (Se você rodou no passo anterior não será necessário nesse passo):

   ```sh
   ./migrate-db.sh
   ```

2. Rode os testes automatizados:

   ```sh
   npm run test:unit
   ```

3. Para rodar os testes de integração:

   ```sh
   npm run test:integration
   ```

4. Para verificar a cobertura dos testes:

   ```sh
   npm run test:cov
   ```

## Tecnologias Utilizadas

- **NestJS**: Framework modular e escalável para aplicações backend, baseado em TypeScript, que facilita a criação de APIs e a implementação de arquitetura limpa.
- **PostgreSQL + Prisma**: PostgreSQL é um banco de dados relacional robusto e confiável. Prisma oferece uma ORM moderna e eficiente, simplificando as interações com o banco de dados e melhorando a produtividade no desenvolvimento.
- **JWT (JSON Web Token)**: Utilizado para autenticação e autorização de usuários, permitindo comunicação segura entre frontend e backend através de tokens.
- **Class-validator**: Biblioteca para validação de dados no backend, garantindo a integridade e consistência dos dados antes de serem processados.
- **Jest**: Framework de testes que facilita a criação e execução de testes unitários e de integração, garantindo a qualidade do código.
- **Swagger**: Ferramenta para gerar documentação interativa da API, facilitando a compreensão e o uso da API por outros desenvolvedores.
- **Winston**: Logger flexível e poderoso, permitindo o registro eficiente de logs e a integração com ferramentas de monitoramento como Papertrail.
- **Clean Architecture**: Padrão de arquitetura que separa as preocupações do sistema, facilitando a manutenção, escalabilidade e testabilidade.
- **RBAC (Role-Based Access Control)**: Mecanismo de controle de acesso baseado em funções, garantindo que usuários tenham apenas as permissões necessárias para suas atividades.
- **Docker**: Ferramenta para containerizar a aplicação, garantindo consistência nos ambientes de desenvolvimento, testes e produção.
- **GitHub Actions**: Serviço de CI/CD para automatizar o processo de integração contínua e entrega contínua, garantindo que os testes sejam executados e a qualidade do código seja mantida.
- **Sonar**: Ferramenta de análise estática de código, integrada ao GitHub Actions, para escanear e identificar problemas de segurança, bugs e vulnerabilidades no código.
- **Papertrail**: Serviço de logging que facilita o monitoramento de logs em tempo real, integrando-se ao Heroku e permitindo visualização e análise de erros e sucessos, além de ser compatível com Grafana para dashboards de performance.

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
- **Atribuir Tarefa a Usuário**: Atribui uma tarefa a um usuário específico.
- **Desatribuir Tarefa de Usuário**: Remove a atribuição de uma tarefa de um usuário.
- **Listar Usuários de uma Tarefa**: Retorna uma lista de usuários atribuídos a uma tarefa.

### Depuração

- Utilizado o winston para organização de logs por data, hora e tipo (success e error)
  exemplo de log:
  ´./logs/2025-03-21-error.log

```log
./logs/2025-03-21-error.log

2025-03-21T19:36:52.639Z [error]: POST /auth/login - Cannot POST /auth/login
2025-03-21T19:37:01.338Z [error]: POST /api/v1/auth/login - ThrottlerException: Too Many Requests
```

```log
./logs/2025-03-21-success.log

2025-03-21T19:36:40.407Z [info]: GET /api/v1/ - 200
2025-03-21T19:36:59.407Z [info]: POST /api/v1/auth/login - 201
```

## Exemplos de Requisições

## Exemplos de Requisições

### HealthCheck

#### Hello-World

```http
GET /api/v1/
```

```sh
curl -X GET "http://localhost:3000/api/v1/"
```

### Autenticação

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "test3@gmail.com",
    "password": "123456"
}
```

```sh
curl -X POST "http://localhost:3000/api/v1/auth/login" -H "Content-Type: application/json" -d '{
    "email": "test3@gmail.com",
    "password": "123456"
}'
```

#### Registro

```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "email": "test3@gmail.com",
    "password": "123456",
    "name": "test3"
}
```

```sh
curl -X POST "http://localhost:3000/api/v1/auth/register" -H "Content-Type: application/json" -d '{
    "email": "test3@gmail.com",
    "password": "123456",
    "name": "test3"
}'
```

### Usuários

#### Listar Usuários

```http
GET /api/v1/users
Authorization: Bearer <token>
```

```sh
curl -X GET "http://localhost:3000/api/v1/users" -H "Authorization: Bearer <token>"
```

#### Obter Perfil do Usuário

```http
GET /api/v1/users/profile
Authorization: Bearer <token>
```

```sh
curl -X GET "http://localhost:3000/api/v1/users/profile" -H "Authorization: Bearer <token>"
```

### Projetos

#### Listar Projetos

```http
GET /api/v1/projects
Authorization: Bearer <token>
```

```sh
curl -X GET "http://localhost:3000/api/v1/projects" -H "Authorization: Bearer <token>"
```

#### Criar Projeto

```http
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Projeto Teste"
}
```

```sh
curl -X POST "http://localhost:3000/api/v1/projects" -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
    "name": "Projeto Teste"
}'
```

#### Adicionar Membro ao Projeto

```http
POST /api/v1/projects/{projectId}/members
Authorization: Bearer <token>
Content-Type: application/json

{
    "userId": "a9695178-55b3-476b-9073-442c0d3fe8e4"
}
```

```sh
curl -X POST "http://localhost:3000/api/v1/projects/{projectId}/members" -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
    "userId": "a9695178-55b3-476b-9073-442c0d3fe8e4"
}'
```

### Tarefas

#### Criar Tarefa

```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Tarefa Teste",
    "projectId": "9f7bda77-7ca7-4be8-b29c-c318b081f59b"
}
```

```sh
curl -X POST "http://localhost:3000/api/v1/tasks" -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
    "title": "Tarefa Teste",
    "projectId": "9f7bda77-7ca7-4be8-b29c-c318b081f59b"
}'
```

#### Listar Tarefas

```http
GET /api/v1/tasks
Authorization: Bearer <token>
```

```sh
curl -X GET "http://localhost:3000/api/v1/tasks" -H "Authorization: Bearer <token>"
```

### Veja mais no Swagger da aplicação

Para mais detalhes sobre as rotas e como utilizá-las, consulte a documentação interativa gerada pelo Swagger:

[Swagger API Docs](https://kanban-api-fbacf9bca2fc.herokuapp.com/api/v1/docs)
ou na rota `/api/v1/docs` da aplicação rodando localmente

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
│── logs/
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

Para rodar os testes de unidade:

```sh
npm run test:unit
```

Para rodar os testes de integração:

```sh
npm run test:integration
```

Para verificar a cobertura dos testes:

```sh
npm run test:coverage
```
