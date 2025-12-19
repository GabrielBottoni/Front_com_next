import Link from 'next/link'

export default function Article({ title, slug, content, author, createdAt, basePath }) {
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content

  return (
    <article className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        <Link 
          href={`/${basePath}/${slug}`}
          className="hover:text-primary-600 transition-colors"
        >
          {title}
        </Link>
      </h2>
      
      <div className="text-sm text-gray-500 mb-4">
        <span>Por {author.name}</span>
        <span className="mx-2">•</span>
        <span>{formattedDate}</span>
      </div>
      
      <p className="text-gray-700 mb-4">{excerpt}</p>
      
      <Link 
        href={`/${basePath}/${slug}`}
        className="text-primary-600 hover:text-primary-700 font-semibold"
      >
        Ler mais →
      </Link>
    </article>
  )
}

