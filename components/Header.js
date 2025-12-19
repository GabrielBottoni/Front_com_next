import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
            Next Front
          </Link>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Posts
            </Link>
            <Link 
              href="/noticias" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Notícias
            </Link>
            <Link 
              href="/projetos" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Projetos
            </Link>
            <Link
              href="/contato"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Contato
            </Link>
            <Link
              href="/graphql-demo"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              GraphQL
            </Link>
            
            {status === 'loading' ? (
              <span className="text-gray-500">Carregando...</span>
            ) : session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-gray-700">
                  Olá, {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

