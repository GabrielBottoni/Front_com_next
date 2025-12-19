import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-600 mb-4">Página não encontrada</h2>
      <p className="text-gray-500 mb-8">
        A página que você está procurando não existe.
      </p>
      <Link 
        href="/"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block"
      >
        Voltar para Home
      </Link>
    </div>
  )
}

