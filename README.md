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
│   ├── modules/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── tasks/
│   ├── config/
│   ├── middlewares/
│   ├── routes/
│   ├── shared/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   ├── tests/
│── docs/
│── .env
│── .gitignore
│── package.json
│── tsconfig.json
│── README.md
```

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
