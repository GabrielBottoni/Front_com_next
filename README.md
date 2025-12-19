# Next Front - Aplicação Next.js Completa

Uma aplicação Next.js completa com autenticação, rotas dinâmicas, API routes, GraphQL e banco de dados.

## Funcionalidades

- ✅ Página home (rota principal "/")
- ✅ Rotas dinâmicas: `/posts/[slug]`, `/noticias/[slug]`, `/projetos/[slug]`
- ✅ Formulários de registro e login
- ✅ Formulário de contato (salva no banco)
- ✅ Sistema de autenticação com NextAuth.js
- ✅ Sessão e login/logout
- ✅ API routes protegidas (requerem autenticação)
- ✅ GraphQL com Yoga (`/api/graphql`)
- ✅ Banco de dados SQLite com Prisma (para produção: recomendado Postgres)
- ✅ Componentes reutilizáveis (Header, Footer, Layout, Article, ContactForm)
- ✅ Design responsivo com Tailwind CSS
- ✅ Páginas com SSR e SSG/ISR (evita renderização desnecessária)
- ✅ Navegação com next/link
- ✅ Validação segura de formulários com Zod

## Tecnologias

- **Next.js 14** - Framework React
- **NextAuth.js** - Autenticação
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **GraphQL Yoga** - API GraphQL
- **Tailwind CSS** - Estilização
- **React Hook Form** - Formulários
- **Zod** - Validação
- **bcryptjs** - Hash de senhas

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (crie um arquivo `.env` na raiz):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="troque-por-um-segredo-aleatorio"
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Execute a aplicação:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
next-front/
├── components/          # Componentes reutilizáveis
│   ├── Header.js
│   ├── Footer.js
│   ├── Layout.js
│   └── Article.js
│   └── ContactForm.js
├── lib/                # Utilitários
│   ├── prisma.js       # Cliente Prisma
│   └── auth.js         # Funções de autenticação
├── pages/              # Páginas e rotas
│   ├── api/            # API routes
│   │   ├── auth/       # Autenticação
│   │   ├── posts/      # Posts API
│   │   ├── noticias/   # Notícias API
│   │   └── projetos/   # Projetos API
│   │   └── graphql.js   # GraphQL Yoga
│   │   └── contact.js   # Contato
│   ├── posts/          # Páginas de posts
│   ├── noticias/       # Páginas de notícias
│   ├── projetos/       # Páginas de projetos
│   ├── index.js        # Home
│   ├── login.js        # Login
│   ├── register.js     # Registro
│   ├── contato.js      # Contato
│   ├── graphql-demo.js # Demo GraphQL (SSR)
│   └── dashboard.js    # Dashboard (SSR)
├── prisma/             # Schema do banco de dados
│   └── schema.prisma
└── styles/             # Estilos globais
    └── globals.css
```

## Rotas da API

### Públicas
- `GET /api/posts` - Listar todos os posts
- `GET /api/posts/[slug]` - Buscar post por slug
- `GET /api/noticias` - Listar todas as notícias
- `GET /api/noticias/[slug]` - Buscar notícia por slug
- `GET /api/projetos` - Listar todos os projetos
- `GET /api/projetos/[slug]` - Buscar projeto por slug
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/contact` - Enviar mensagem de contato (salva no banco)
- `POST /api/graphql` - Endpoint GraphQL (Yoga)

### Protegidas (requerem autenticação)
- `POST /api/posts` - Criar novo post
- `POST /api/noticias` - Criar nova notícia
- `POST /api/projetos` - Criar novo projeto

## Páginas e renderização

- **SSR**: `/dashboard` (protegida) e `/graphql-demo`
- **SSG/ISR**: `/`, `/posts`, `/noticias`, `/projetos` e as páginas dinâmicas (`[slug]`) com `fallback: "blocking"`

## Segurança

- Senhas são hasheadas com bcryptjs antes de serem armazenadas
- Validação de dados com Zod em todas as rotas da API
- Autenticação JWT com NextAuth.js
- Proteção de rotas da API com verificação de sessão
- Validação de formulários no cliente e servidor

## Deploy (Serverless)

- **Sugestão**: Vercel.
- **Importante**: SQLite em arquivo não é o ideal em ambiente serverless. Para produção, prefira **PostgreSQL** (ex.: Neon/Supabase) e ajuste `DATABASE_URL`.

## Desenvolvimento

Para visualizar o banco de dados:
```bash
npx prisma studio
```

Para criar uma nova migration:
```bash
npx prisma migrate dev --name nome_da_migration
```

## Licença

MIT

