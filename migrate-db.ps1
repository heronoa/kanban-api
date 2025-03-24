function run_migrations {
    param (
        [string]$DATABASE_ENV,
        [string]$SCHEMA_PATH
    )

    Write-Host "Rodando migrações para o banco de dados: $DATABASE_ENV"

    if ($DATABASE_ENV -eq "test") {
        Write-Host "Carregando variáveis de ambiente do banco de dados de teste..."
        Get-Content .env.test | ForEach-Object {
            $name, $value = $_ -split '='
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
        }
    } else {
        Write-Host "Carregando variáveis de ambiente do banco de dados de produção..."
        Get-Content .env | ForEach-Object {
            $name, $value = $_ -split '='
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
        }
    }

    Write-Host "Usando DATABASE_URL: $env:DATABASE_URL"

    npx prisma migrate deploy --schema=$SCHEMA_PATH

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migrações aplicadas com sucesso no banco de dados $DATABASE_ENV."
    } else {
        Write-Host "Erro ao aplicar migrações no banco de dados $DATABASE_ENV."
        exit 1
    }
}

run_migrations "test" "src/infrastructure/database/prisma/schema.prisma"
run_migrations "prod" "src/infrastructure/database/prisma/schema.prisma"
