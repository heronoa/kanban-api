run_migrations() {
  DATABASE_ENV=$1
  SCHEMA_PATH=$2

  echo "Rodando migrações para o banco de dados: $DATABASE_ENV"

  if [ "$DATABASE_ENV" == "test" ]; then
    echo "Carregando variáveis de ambiente do banco de dados de teste..."
    set -a  
    source .env.test  
    set +a  
  else
    echo "Carregando variáveis de ambiente do banco de dados de produção..."
    set -a  
    source .env  
    set +a  
  fi

  echo "Usando DATABASE_URL: $DATABASE_URL"

  npx prisma migrate deploy --schema=$SCHEMA_PATH

  if [ $? -eq 0 ]; then
    echo "Migrações aplicadas com sucesso no banco de dados $DATABASE_ENV."
  else
    echo "Erro ao aplicar migrações no banco de dados $DATABASE_ENV."
    exit 1
  fi
}

run_migrations "test" "src/infrastructure/database/prisma/schema.prisma"

run_migrations "prod" "src/infrastructure/database/prisma/schema.prisma"
