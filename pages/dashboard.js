import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import { prisma } from '../lib/prisma'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, gql } from '@apollo/client'

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $slug: String!, $content: String!) {
    createPost(title: $title, slug: $slug, content: $content) {
      id
      title
      slug
    }
  }
`

const CREATE_NOTICIA_MUTATION = gql`
  mutation CreateNoticia($title: String!, $slug: String!, $content: String!) {
    createNoticia(title: $title, slug: $slug, content: $content) {
      id
      title
      slug
    }
  }
`

const CREATE_PROJETO_MUTATION = gql`
  mutation CreateProjeto($title: String!, $slug: String!, $content: String!) {
    createProjeto(title: $title, slug: $slug, content: $content) {
      id
      title
      slug
    }
  }
`

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function Dashboard({ initialData }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(initialData || { posts: 0, noticias: 0, projetos: 0 })
  const [activeTab, setActiveTab] = useState('posts')
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: () => {
      setMessage({ type: 'success', text: 'Post criado com sucesso!' })
      setFormData({ title: '', content: '' })
      setStats(prev => ({ ...prev, posts: prev.posts + 1 }))
      router.reload()
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao criar post' })
    },
  })

  const [createNoticia] = useMutation(CREATE_NOTICIA_MUTATION, {
    onCompleted: () => {
      setMessage({ type: 'success', text: 'Notícia criada com sucesso!' })
      setFormData({ title: '', content: '' })
      setStats(prev => ({ ...prev, noticias: prev.noticias + 1 }))
      router.reload()
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao criar notícia' })
    },
  })

  const [createProjeto] = useMutation(CREATE_PROJETO_MUTATION, {
    onCompleted: () => {
      setMessage({ type: 'success', text: 'Projeto criado com sucesso!' })
      setFormData({ title: '', content: '' })
      setStats(prev => ({ ...prev, projetos: prev.projetos + 1 }))
      router.reload()
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao criar projeto' })
    },
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    const slug = generateSlug(formData.title)

    try {
      if (activeTab === 'posts') {
        await createPost({ variables: { title: formData.title, slug, content: formData.content } })
      } else if (activeTab === 'noticias') {
        await createNoticia({ variables: { title: formData.title, slug, content: formData.content } })
      } else if (activeTab === 'projetos') {
        await createProjeto({ variables: { title: formData.title, slug, content: formData.content } })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao criar conteúdo' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Posts</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.posts}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Notícias</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.noticias}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Projetos</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.projetos}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar Novo Conteúdo</h2>
        
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Post
          </button>
          <button
            onClick={() => setActiveTab('noticias')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'noticias'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Notícia
          </button>
          <button
            onClick={() => setActiveTab('projetos')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'projetos'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Projeto
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-4 px-4 py-3 rounded ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Digite o título do ${activeTab === 'posts' ? 'post' : activeTab === 'noticias' ? 'notícia' : 'projeto'}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Slug gerado automaticamente: {formData.title ? generateSlug(formData.title) : '...'}
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <textarea
              id="content"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Digite o conteúdo do ${activeTab === 'posts' ? 'post' : activeTab === 'noticias' ? 'notícia' : 'projeto'}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Criando...' : `Criar ${activeTab === 'posts' ? 'Post' : activeTab === 'noticias' ? 'Notícia' : 'Projeto'}`}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo, {session.user.name}!</h2>
        <p className="text-gray-600">
          Esta é uma página protegida que utiliza Server-Side Rendering (SSR) para buscar dados do servidor.
        </p>
        <p className="text-gray-600 mt-2">
          Use o formulário acima para criar novos posts, notícias ou projetos.
        </p>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  try {
    const [posts, noticias, projetos] = await Promise.all([
      prisma.post.count(),
      prisma.noticia.count(),
      prisma.projeto.count(),
    ])

    return {
      props: {
        initialData: {
          posts,
          noticias,
          projetos,
        },
      },
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    return {
      props: {
        initialData: {
          posts: 0,
          noticias: 0,
          projetos: 0,
        },
      },
    }
  }
}
