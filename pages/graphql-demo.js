import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function GraphqlDemo({ posts, noticias, projetos, me, error }) {
  const { data: session } = useSession()
  const currentUser = me || (session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email
  } : null)
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">GraphQL (Yoga) - Demo</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">📊 Utilidade desta página</h2>
        <p className="text-blue-800 mb-3">
          Esta página demonstra o uso da API GraphQL da aplicação. Ela consome o endpoint <code className="bg-blue-100 px-2 py-1 rounded text-sm">/api/graphql</code> e exibe:
        </p>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Posts, notícias e projetos do banco de dados</li>
          <li>Informações da sessão do usuário logado</li>
          <li>Exemplo de queries GraphQL em ação</li>
          <li>Tratamento de erros da API</li>
        </ul>
        <p className="text-blue-800 mt-3 text-sm">
          <strong>Nota:</strong> Faça login para testar queries e mutações protegidas que requerem autenticação.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sessão</h2>
        {currentUser ? (
          <div>
            <p className="text-gray-700 mb-2">
              Logado como <strong>{currentUser.name}</strong> ({currentUser.email})
            </p>
            <p className="text-sm text-gray-500">
              {me ? 'Sessão obtida via GraphQL' : 'Sessão obtida via NextAuth (cliente)'}
            </p>
          </div>
        ) : (
          <p className="text-gray-700">
            Você não está logado. Faça <Link className="text-primary-600 hover:text-primary-700 font-semibold" href="/login">login</Link>{' '}
            para testar queries/mutações protegidas.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
          {posts.length ? (
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link className="text-primary-600 hover:text-primary-700 font-semibold" href={`/posts/${p.slug}`}>
                    {p.title}
                  </Link>
                  <div className="text-sm text-gray-500">Por {p.author.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Sem posts ainda.</p>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notícias</h2>
          {noticias.length ? (
            <ul className="space-y-2">
              {noticias.map((n) => (
                <li key={n.id}>
                  <Link className="text-primary-600 hover:text-primary-700 font-semibold" href={`/noticias/${n.slug}`}>
                    {n.title}
                  </Link>
                  <div className="text-sm text-gray-500">Por {n.author.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Sem notícias ainda.</p>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Projetos</h2>
          {projetos.length ? (
            <ul className="space-y-2">
              {projetos.map((p) => (
                <li key={p.id}>
                  <Link className="text-primary-600 hover:text-primary-700 font-semibold" href={`/projetos/${p.slug}`}>
                    {p.title}
                  </Link>
                  <div className="text-sm text-gray-500">Por {p.author.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Sem projetos ainda.</p>
          )}
        </section>
      </div>
    </div>
  )
}

async function fetchGraphql(url, query, variables, cookie) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  return { res, json }
}

export async function getServerSideProps({ req }) {
  const proto = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host
  const url = `${proto}://${host}/api/graphql`

  const query = `
    query Demo($limit: Int!) {
      me { id name email }
      posts(limit: $limit) { id title slug author { id name email } }
      noticias(limit: $limit) { id title slug author { id name email } }
      projetos(limit: $limit) { id title slug author { id name email } }
    }
  `

  try {
    const cookieHeader = req.headers.cookie || ''
    const { json, res } = await fetchGraphql(url, query, { limit: 5 }, cookieHeader)

    if (!res.ok) {
      console.error('Erro HTTP na resposta GraphQL:', res.status, res.statusText)
      return {
        props: {
          posts: [],
          noticias: [],
          projetos: [],
          me: null,
          error: `Erro HTTP ${res.status}: ${res.statusText || 'Não foi possível conectar à API GraphQL'}`,
        },
      }
    }

    if (json?.errors?.length) {
      const firstError = json.errors[0]
      const errorMessage = firstError?.message || 'Erro desconhecido ao consultar GraphQL'
      console.error('Erro GraphQL:', firstError)
      
      return {
        props: {
          posts: json?.data?.posts || [],
          noticias: json?.data?.noticias || [],
          projetos: json?.data?.projetos || [],
          me: json?.data?.me || null,
          error: errorMessage,
        },
      }
    }

    if (!json?.data) {
      console.error('Resposta GraphQL sem dados:', json)
      return {
        props: {
          posts: [],
          noticias: [],
          projetos: [],
          me: null,
          error: 'Resposta inválida da API GraphQL (sem dados)',
        },
      }
    }

    return {
      props: {
        posts: json.data.posts || [],
        noticias: json.data.noticias || [],
        projetos: json.data.projetos || [],
        me: json.data.me || null,
        error: null,
      },
    }
  } catch (e) {
    console.error('Erro ao buscar dados GraphQL:', e)
    return {
      props: {
        posts: [],
        noticias: [],
        projetos: [],
        me: null,
        error: `Erro ao consultar GraphQL: ${e.message || e.toString() || 'Erro desconhecido'}`,
      },
    }
  }
}


