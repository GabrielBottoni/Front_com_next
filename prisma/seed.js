const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  })

  if (!user) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    user = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: hashedPassword,
      },
    })
  }

  const posts = [
    {
      title: 'Introdução ao Next.js',
      slug: 'introducao-ao-nextjs',
      content: 'Next.js é um framework React que permite criar aplicações web modernas com renderização do lado do servidor, geração de sites estáticos e muito mais. Neste post, vamos explorar os conceitos básicos e como começar a usar o Next.js em seus projetos.',
    },
    {
      title: 'Autenticação com NextAuth.js',
      slug: 'autenticacao-com-nextauth',
      content: 'Aprenda como implementar autenticação segura em suas aplicações Next.js usando NextAuth.js. Vamos cobrir desde a configuração básica até estratégias avançadas de autenticação com múltiplos provedores.',
    },
    {
      title: 'GraphQL com Apollo Client',
      slug: 'graphql-com-apollo-client',
      content: 'Descubra como integrar GraphQL em suas aplicações Next.js usando Apollo Client. Vamos explorar queries, mutations, subscriptions e como gerenciar o estado da aplicação de forma eficiente.',
    },
    {
      title: 'Prisma ORM: Guia Completo',
      slug: 'prisma-orm-guia-completo',
      content: 'Prisma é uma ferramenta moderna de ORM que simplifica o trabalho com bancos de dados. Neste guia, vamos aprender como configurar o Prisma, criar modelos, executar migrações e fazer queries complexas.',
    },
    {
      title: 'Tailwind CSS: Estilização Moderna',
      slug: 'tailwind-css-estilizacao-moderna',
      content: 'Tailwind CSS é um framework CSS utility-first que permite criar interfaces modernas rapidamente. Vamos ver como usar o Tailwind em projetos Next.js e criar componentes estilizados de forma eficiente.',
    },
  ]

  const noticias = [
    {
      title: 'Nova Versão do Next.js Lançada',
      slug: 'nova-versao-nextjs-lancada',
      content: 'A equipe do Next.js anunciou o lançamento da versão 14.2, trazendo melhorias significativas em performance, novas APIs e correções de bugs importantes. Esta atualização inclui suporte aprimorado para React Server Components e otimizações no sistema de roteamento.',
    },
    {
      title: 'React 19: O Que Esperar',
      slug: 'react-19-o-que-esperar',
      content: 'O React 19 está chegando com várias novidades empolgantes. Entre as principais mudanças estão melhorias no sistema de hooks, novo compilador experimental e otimizações de performance. A comunidade está ansiosa para testar as novas funcionalidades.',
    },
    {
      title: 'TypeScript 5.0: Novidades e Melhorias',
      slug: 'typescript-50-novidades',
      content: 'TypeScript 5.0 foi lançado com melhorias significativas em performance e novas funcionalidades. O compilador agora é mais rápido, e há suporte para decorators e outras features modernas do JavaScript.',
    },
    {
      title: 'Prisma 5.0: Novas Features',
      slug: 'prisma-50-novas-features',
      content: 'A nova versão do Prisma traz melhorias no desempenho, suporte para novos bancos de dados e ferramentas aprimoradas para desenvolvimento. Os desenvolvedores podem esperar uma experiência ainda melhor ao trabalhar com bancos de dados.',
    },
  ]

  const projetos = [
    {
      title: 'E-commerce com Next.js',
      slug: 'ecommerce-com-nextjs',
      content: 'Desenvolvimento de uma plataforma de e-commerce completa usando Next.js, Prisma e Stripe. O projeto inclui sistema de autenticação, carrinho de compras, processamento de pagamentos e painel administrativo.',
    },
    {
      title: 'Blog Pessoal Moderno',
      slug: 'blog-pessoal-moderno',
      content: 'Criação de um blog pessoal usando Next.js com suporte a Markdown, sistema de comentários, busca e categorias. O projeto utiliza ISR (Incremental Static Regeneration) para otimização de performance.',
    },
    {
      title: 'Dashboard Analytics',
      slug: 'dashboard-analytics',
      content: 'Desenvolvimento de um dashboard de analytics com gráficos interativos, visualização de dados em tempo real e exportação de relatórios. Utiliza Next.js, Chart.js e WebSockets para atualizações em tempo real.',
    },
    {
      title: 'Sistema de Gerenciamento de Tarefas',
      slug: 'sistema-gerenciamento-tarefas',
      content: 'Aplicação completa de gerenciamento de tarefas com drag-and-drop, filtros avançados, notificações e colaboração em tempo real. Desenvolvido com Next.js, Prisma e Socket.io.',
    },
    {
      title: 'Plataforma de Cursos Online',
      slug: 'plataforma-cursos-online',
      content: 'Sistema de ensino a distância com vídeos, quizzes, certificados e acompanhamento de progresso. Inclui sistema de pagamentos, área do aluno e painel do instrutor.',
    },
  ]

  const created = { posts: 0, noticias: 0, projetos: 0 }

  for (const postData of posts) {
    const existingPost = await prisma.post.findUnique({ where: { slug: postData.slug } })
    if (!existingPost) {
      await prisma.post.create({ data: { ...postData, authorId: user.id } })
      created.posts += 1
    }
  }

  for (const noticiaData of noticias) {
    const existingNoticia = await prisma.noticia.findUnique({ where: { slug: noticiaData.slug } })
    if (!existingNoticia) {
      await prisma.noticia.create({ data: { ...noticiaData, authorId: user.id } })
      created.noticias += 1
    }
  }

  for (const projetoData of projetos) {
    const existingProjeto = await prisma.projeto.findUnique({ where: { slug: projetoData.slug } })
    if (!existingProjeto) {
      await prisma.projeto.create({ data: { ...projetoData, authorId: user.id } })
      created.projetos += 1
    }
  }
  return created
}
async function run(created) {
  const result = { created }
  console.log(`Seed summary: created ${created.posts} posts, ${created.noticias} noticias, ${created.projetos} projetos`)
  return result
}

main()
  .then((created) => run(created))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

