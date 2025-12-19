import { createSchema, createYoga } from 'graphql-yoga'
import { getServerSession } from 'next-auth/next'
import { prisma } from '../../lib/prisma'
import { authOptions } from '../../lib/auth'

function toIso(date) {
  if (!date) return null
  if (typeof date === 'string') return date
  return date.toISOString()
}

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    slug: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type Noticia {
    id: ID!
    title: String!
    slug: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type Projeto {
    id: ID!
    title: String!
    slug: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type ContactMessage {
    id: ID!
    name: String!
    email: String!
    message: String!
    createdAt: String!
  }

  type Query {
    posts(limit: Int = 20): [Post!]!
    postBySlug(slug: String!): Post

    noticias(limit: Int = 20): [Noticia!]!
    noticiaBySlug(slug: String!): Noticia

    projetos(limit: Int = 20): [Projeto!]!
    projetoBySlug(slug: String!): Projeto

    me: User
    contactMessages(limit: Int = 20): [ContactMessage!]!
  }

  type Mutation {
    createPost(title: String!, slug: String!, content: String!): Post!
    createNoticia(title: String!, slug: String!, content: String!): Noticia!
    createProjeto(title: String!, slug: String!, content: String!): Projeto!
    createContactMessage(name: String!, email: String!, message: String!): ContactMessage!
  }
`

const resolvers = {
  Query: {
    posts: async (_, { limit }) => {
      try {
        const items = await prisma.post.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, email: true } } },
        })
        return items.map((p) => ({ ...p, createdAt: toIso(p.createdAt), updatedAt: toIso(p.updatedAt) }))
      } catch (error) {
        throw new Error('Erro ao buscar posts do banco de dados')
      }
    },
    postBySlug: async (_, { slug }) => {
      const p = await prisma.post.findUnique({
        where: { slug },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      if (!p) return null
      return { ...p, createdAt: toIso(p.createdAt), updatedAt: toIso(p.updatedAt) }
    },

    noticias: async (_, { limit }) => {
      try {
        const items = await prisma.noticia.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, email: true } } },
        })
        return items.map((n) => ({ ...n, createdAt: toIso(n.createdAt), updatedAt: toIso(n.updatedAt) }))
      } catch (error) {
        throw new Error('Erro ao buscar notícias do banco de dados')
      }
    },
    noticiaBySlug: async (_, { slug }) => {
      const n = await prisma.noticia.findUnique({
        where: { slug },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      if (!n) return null
      return { ...n, createdAt: toIso(n.createdAt), updatedAt: toIso(n.updatedAt) }
    },

    projetos: async (_, { limit }) => {
      try {
        const items = await prisma.projeto.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, email: true } } },
        })
        return items.map((p) => ({ ...p, createdAt: toIso(p.createdAt), updatedAt: toIso(p.updatedAt) }))
      } catch (error) {
        throw new Error('Erro ao buscar projetos do banco de dados')
      }
    },
    projetoBySlug: async (_, { slug }) => {
      const p = await prisma.projeto.findUnique({
        where: { slug },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      if (!p) return null
      return { ...p, createdAt: toIso(p.createdAt), updatedAt: toIso(p.updatedAt) }
    },

    me: async (_, __, ctx) => {
      if (!ctx.session || !ctx.session.user) {
        return null
      }
      return {
        id: ctx.session.user.id,
        name: ctx.session.user.name,
        email: ctx.session.user.email,
      }
    },

    contactMessages: async (_, { limit }, ctx) => {
      if (!ctx.session) throw new Error('Não autorizado')
      const items = await prisma.contactMessage.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return items.map((c) => ({ ...c, createdAt: toIso(c.createdAt) }))
    },
  },

  Mutation: {
    createPost: async (_, { title, slug, content }, ctx) => {
      if (!ctx.session) throw new Error('Não autorizado')
      const created = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          authorId: ctx.session.user.id,
        },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      return { ...created, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) }
    },
    createNoticia: async (_, { title, slug, content }, ctx) => {
      if (!ctx.session) throw new Error('Não autorizado')
      const created = await prisma.noticia.create({
        data: {
          title,
          slug,
          content,
          authorId: ctx.session.user.id,
        },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      return { ...created, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) }
    },
    createProjeto: async (_, { title, slug, content }, ctx) => {
      if (!ctx.session) throw new Error('Não autorizado')
      const created = await prisma.projeto.create({
        data: {
          title,
          slug,
          content,
          authorId: ctx.session.user.id,
        },
        include: { author: { select: { id: true, name: true, email: true } } },
      })
      return { ...created, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) }
    },
    createContactMessage: async (_, { name, email, message }) => {
      const created = await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        },
      })
      return { ...created, createdAt: toIso(created.createdAt) }
    },
  },
}

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  context: async ({ request }) => {
    try {
      if (!request) {
        return { session: null }
      }

      const cookie = request.headers.get('cookie') || ''
      const headersObj = {}
      request.headers.forEach((value, key) => {
        headersObj[key] = value
      })

      const nextReq = {
        headers: headersObj,
        cookies: cookie,
      }

      const nextRes = {
        setHeader: () => { },
        getHeader: () => null,
      }

      const session = await getServerSession(nextReq, nextRes, authOptions)

      return { session }
    } catch (error) {
      return { session: null }
    }
  },
  maskedErrors: {
    maskError(error, message, isDev) {
      if (isDev) {
        return error
      }
      if (error.message.includes('Não autorizado')) {
        return new Error('Não autorizado')
      }
      if (error.message.includes('Prisma')) {
        return new Error('Erro ao acessar o banco de dados')
      }
      return new Error('Erro interno do servidor')
    },
  },
})

export default yoga

export const config = {
  api: {
    bodyParser: false,
  },
}
