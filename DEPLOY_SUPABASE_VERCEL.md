Deploy: Supabase (Postgres) + Vercel
=================================

Este guia descreve passo a passo como conectar sua aplicação Next.js (com Prisma) ao Supabase e fazer o deploy no Vercel.

Pré-requisitos
--------------
- Conta no Supabase (https://app.supabase.com)
- Conta no Vercel (https://vercel.com)
- Projeto Git com o código (repositório no GitHub ou GitLab)
- Node.js e npm instalados localmente

Resumo das etapas
-----------------
1. Criar projeto no Supabase e copiar a connection string
2. Atualizar `prisma/schema.prisma` para `provider = "postgresql"`
3. Configurar `.env` local com `DATABASE_URL`, `NEXTAUTH_URL` e `NEXTAUTH_SECRET`
4. Gerar Prisma Client e criar/aplicar migrations localmente
5. Rodar `prisma:seed` para popular admin e dados iniciais
6. Subir o repositório para GitHub e conectar ao Vercel
7. Configurar variáveis de ambiente no Vercel e fazer deploy
8. Executar migrations/seed em produção (via CLI apontando para o Supabase)

Detalhes passo a passo
----------------------

1) Criar projeto no Supabase

- Entre em https://app.supabase.com e faça login.
- Clique em "New project" e preencha nome/organização e senha do banco.
- Após criado, vá em "Settings → Database → Connection string" e copie a connection string (URI) do Postgres.

Exemplo de connection string:
postgresql://USER:PASSWORD@db.aaabbbccc.supabase.co:5432/postgres

2) Atualizar `prisma/schema.prisma`

Abra `prisma/schema.prisma` e altere o bloco `datasource` para usar PostgreSQL:

```diff
 datasource db {
-  provider = "sqlite"
-  url      = env("DATABASE_URL")
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
 }
```

Salve o arquivo e commit.

3) Configurar `.env` (local)

Crie/edite o arquivo `.env` na raiz do projeto:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="(gerar com openssl rand -base64 32)"
```

Gerar `NEXTAUTH_SECRET`:

```bash
# macOS / Linux
openssl rand -base64 32

# PowerShell (Windows)
[Convert]::ToBase64String((New-Object Byte[] 32 | ForEach-Object {Get-Random -Maximum 256}))
```

4) Gerar Prisma Client e criar/aplicar migrations (localmente)

```bash
npm install
npx prisma generate
# no modo dev (cria migration e aplica) - vai pedir confirmação
npx prisma migrate dev --name init
```

Se preferir apenas empurrar esquema sem migration interativa (menos recomendado):

```bash
npx prisma db push
```

5) Rodar seed para popular dados iniciais

O projeto já tem `prisma/seed.js` e script no `package.json` (`prisma:seed`).

```bash
npm run prisma:seed
```

Isto criará o usuario admin (se não existir):

Email: admin@example.com
Senha: admin123

> Troque a senha após o primeiro login.

6) Subir código para GitHub e conectar no Vercel

```bash
git add .
git commit -m "Prepare prisma for Supabase"
git push origin main
```

- No Vercel, clique em "New Project" → importe o repositório.

7) Configurar variáveis de ambiente no Vercel

No painel do projeto Vercel → Settings → Environment Variables, adicione:

- `DATABASE_URL` = (connection string do Supabase)
- `NEXTAUTH_URL` = `https://<seu-projeto>.vercel.app`
- `NEXTAUTH_SECRET` = (valor gerado)

Use as variáveis para os ambientes `Production` e `Preview` conforme desejar.

8) Deploy & executar migrations/seed em produção

Após o deploy inicial, execute as migrations e seed apontando para o banco remoto.
Você pode executar localmente usando a `DATABASE_URL` do Supabase (no .env local ou exportada no terminal):

```bash
# Unix / macOS
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
npx prisma migrate deploy
npm run prisma:seed

# PowerShell (Windows)
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
npx prisma migrate deploy
npm run prisma:seed
```

Isto garante que as tabelas serão criadas no Supabase (produção) e os dados iniciais serão inseridos.

Migração de dados do SQLite (opcional)
--------------------------------------
Se tiver dados no `prisma/dev.db` e quiser migrá-los para o Supabase, duas opções:

A) Script Node (prisma) que lê do SQLite e escreve no Postgres (podemos adicionar um script `scripts/migrate-sqlite-to-postgres.js`).
B) Exportar tabelas como CSV e importar no Supabase via painel SQL/CSV.

Se quiser, eu gero o script e adiciono em `scripts/`.

Notas de segurança
------------------
- Nunca commit seu `.env` com credenciais.
- Use `NEXTAUTH_SECRET` forte.
- Habilite backups no Supabase.
- Remova ou altere `admin@example.com`/`admin123` em produção.

Precisa que eu agora:
- (A) aplique a alteração em `prisma/schema.prisma` e abra um commit, ou
- (B) gere o script de migração SQLite → Postgres em `scripts/`, ou
- (C) apenas guie você enquanto executa os passos?

Escolha A, B ou C e eu executo o próximo passo.
