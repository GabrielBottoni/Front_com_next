# Guia de Configuração

## Passo a Passo para Configurar o Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

**Importante:** Para gerar uma chave secreta segura para `NEXTAUTH_SECRET`, você pode usar:

```bash
openssl rand -base64 32
```

Ou acesse: `https://generate-secret.vercel.app/32`

### 3. Configurar o Banco de Dados

Execute os seguintes comandos para criar o banco de dados:

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar/aplicar migrations e o banco de dados
npx prisma migrate dev
```

Isso criará o arquivo `prisma/dev.db` (banco de dados SQLite) e todas as tabelas necessárias.

### 4. Executar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## Rotas principais para testar

- Home: `/`
- Posts: `/posts` e `/posts/[slug]`
- Notícias: `/noticias` e `/noticias/[slug]`
- Projetos: `/projetos` e `/projetos/[slug]`
- Contato (salva no banco): `/contato`
- GraphQL Demo: `/graphql-demo`
- Dashboard (SSR + protegido): `/dashboard`

### 5. (Opcional) Visualizar o Banco de Dados

Para abrir o Prisma Studio e visualizar/editar dados:

```bash
npx prisma studio
```

## Testando a Aplicação

1. **Criar uma conta:**
   - Acesse `/register`
   - Preencha o formulário
   - Clique em "Registrar"

2. **Fazer login:**
   - Acesse `/login`
   - Use as credenciais criadas
   - Você será redirecionado para a home

3. **Navegar pelas páginas:**
   - Home (`/`) - Página principal
   - Posts (`/posts`) - Lista de posts
   - Notícias (`/noticias`) - Lista de notícias
   - Projetos (`/projetos`) - Lista de projetos
   - Dashboard (`/dashboard`) - Página protegida com SSR

4. **Testar rotas dinâmicas:**
   - Acesse `/posts/[slug]` (substitua [slug] por um slug válido)
   - Acesse `/noticias/[slug]`
   - Acesse `/projetos/[slug]`

5. **Testar ContactForm (salva no banco):**
   - Acesse `/contato`
   - Envie uma mensagem
   - (Opcional) Abra o Prisma Studio para ver o registro em `ContactMessage`

6. **Testar GraphQL (Yoga):**
   - Acesse `/graphql-demo`
   - Endpoint: `/api/graphql`

## Estrutura de Dados

O banco de dados possui as seguintes tabelas:

- **User**: Usuários do sistema
- **Post**: Posts do blog
- **Noticia**: Notícias
- **Projeto**: Projetos
- **ContactMessage**: Mensagens do formulário de contato

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar em produção
npm start

# Gerar cliente Prisma
npm run prisma:generate

# Criar nova migration
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

## Solução de Problemas

### Erro: "Prisma Client hasn't been generated yet"
Execute: `npx prisma generate`

### Erro: "Database does not exist"
Execute: `npx prisma migrate dev --name init`

### Erro: "NEXTAUTH_SECRET is not set"
Certifique-se de que o arquivo `.env` existe e contém `NEXTAUTH_SECRET`

## Deploy (Vercel)

1. Suba o projeto no GitHub.
2. Crie um projeto na Vercel apontando para o repositório.
3. Configure as variáveis de ambiente na Vercel (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
4. Faça o deploy.

**Nota importante:** SQLite (arquivo) não é o ideal em ambiente serverless. Para produção, prefira PostgreSQL (ex.: Neon/Supabase) e use uma `DATABASE_URL` compatível.

