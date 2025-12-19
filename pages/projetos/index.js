import Article from '../../components/Article'

export default function Projetos({ projetos }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Todos os Projetos</h1>
      
      {projetos.length > 0 ? (
        <div>
          {projetos.map((projeto) => (
            <Article key={projeto.id} {...projeto} basePath="projetos" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhum projeto disponível no momento.</p>
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
  const projetos = await prisma.projeto.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true, email: true } } },
  })

  return {
    props: {
      projetos: projetos.map(serializeWithAuthor),
    },
    revalidate: 60,
  }
}

