import Link from 'next/link'
import Article from '../components/Article'
import { useQuery, gql } from '@apollo/client'

const HOME_DATA_QUERY = gql`
  query HomeData {
    posts(limit: 3) {
      id
      title
      content
      slug
      createdAt
      author {
        name
        email
      }
    }
    noticias(limit: 3) {
      id
      title
      content
      slug
      createdAt
      author {
        name
      }
    }
    projetos(limit: 3) {
      id
      title
      content
      slug
      createdAt
      author {
        name
      }
    }
  }
`

export default function Home({ posts: initialPosts, noticias: initialNoticias, projetos: initialProjetos }) {
  const { data, loading, error } = useQuery(HOME_DATA_QUERY, {
    skip: !initialPosts,
  });

  const posts = data?.posts || initialPosts;
  const noticias = data?.noticias || initialNoticias;
  const projetos = data?.projetos || initialProjetos;

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Next Front
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Uma aplicação para divulgação de notícias e projetos para desenvolvedores.
        </p>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Posts Recentes</h2>
          <Link
            href="/posts"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver todos →
          </Link>
        </div>
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <Article key={post.id} {...post} basePath="posts" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum post disponível.</p>
        )}
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Notícias Recentes</h2>
          <Link
            href="/noticias"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver todas →
          </Link>
        </div>
        {noticias.length > 0 ? (
          <div>
            {noticias.map((noticia) => (
              <Article key={noticia.id} {...noticia} basePath="noticias" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma notícia disponível.</p>
        )}
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Projetos Recentes</h2>
          <Link
            href="/projetos"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver todos →
          </Link>
        </div>
        {projetos.length > 0 ? (
          <div>
            {projetos.map((projeto) => (
              <Article key={projeto.id} {...projeto} basePath="projetos" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum projeto disponível.</p>
        )}
      </section>
    </div>
  )
}

export async function getStaticProps() {
  const client = (await import('../lib/apollo')).default;

  try {
    const { data } = await client.query({
      query: HOME_DATA_QUERY,
      fetchPolicy: 'no-cache',
    });

    return {
      props: {
        posts: data.posts || [],
        noticias: data.noticias || [],
        projetos: data.projetos || [],
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: { posts: [], noticias: [], projetos: [] },
      revalidate: 60,
    }
  }
}
