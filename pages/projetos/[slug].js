export default function ProjetoDetail({ projeto }) {
  const formattedDate = new Date(projeto.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <article className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{projeto.title}</h1>
      
      <div className="text-sm text-gray-500 mb-6 pb-6 border-b">
        <span>Por <strong>{projeto.author.name}</strong></span>
        <span className="mx-2">•</span>
        <span>{formattedDate}</span>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {projeto.content}
        </p>
      </div>
    </article>
  )
}

function serializeProjeto(p) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export async function getStaticPaths() {
  const { prisma } = await import('../../lib/prisma')
  const items = await prisma.projeto.findMany({
    select: { slug: true },
    take: 50,
    orderBy: { createdAt: 'desc' },
  })

  return {
    paths: items.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const { prisma } = await import('../../lib/prisma')
  const projeto = await prisma.projeto.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { id: true, name: true, email: true } } },
  })

  if (!projeto) {
    return { notFound: true, revalidate: 30 }
  }

  return {
    props: {
      projeto: serializeProjeto(projeto),
    },
    revalidate: 60,
  }
}

