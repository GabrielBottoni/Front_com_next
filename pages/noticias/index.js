import Article from '../../components/Article'

export default function Noticias({ noticias }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Todas as Notícias</h1>
      
      {noticias.length > 0 ? (
        <div>
          {noticias.map((noticia) => (
            <Article key={noticia.id} {...noticia} basePath="noticias" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhuma notícia disponível no momento.</p>
        </div>
      )}
    </div>
  )
}

function serializeWithAuthor(item) {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export async function getStaticProps() {
  const { prisma } = await import('../../lib/prisma')
  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true, email: true } } },
  })

  return {
    props: {
      noticias: noticias.map(serializeWithAuthor),
    },
    revalidate: 60,
  }
}

