import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Next Front</h3>
            <p className="text-gray-400">
              Uma aplicação Next.js completa com autenticação, rotas dinâmicas e API routes.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-white transition-colors">Posts</Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white transition-colors">Notícias</Link>
              </li>
              <li>
                <Link href="/projetos" className="hover:text-white transition-colors">Projetos</Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
              </li>
              <li>
                <Link href="/graphql-demo" className="hover:text-white transition-colors">GraphQL</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-gray-400">
              Email: contato@nextfront.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Next Front. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

