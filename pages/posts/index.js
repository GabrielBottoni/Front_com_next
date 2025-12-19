import Article from '../../components/Article'

export default function Posts({ posts }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Todos os Posts</h1>
      
      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <Article key={post.id} {...post} basePath="posts" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhum post disponível no momento.</p>
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
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true, email: true } } },
  })

  return {
    props: {
      posts: posts.map(serializeWithAuthor),
    },
    revalidate: 60,
  }
}

