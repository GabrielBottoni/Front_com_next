import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import { prisma } from '../lib/prisma'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard({ initialData }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(initialData || { posts: 0, noticias: 0, projetos: 0 })

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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo, {session.user.name}!</h2>
        <p className="text-gray-600">
          Esta é uma página protegida que utiliza Server-Side Rendering (SSR) para buscar dados do servidor.
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
