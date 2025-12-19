import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(400).json({ ok: false, message: 'DATABASE_URL não está configurada. Defina a variável de ambiente e tente novamente.' })
  }

  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`

    const safe = JSON.parse(JSON.stringify(result, (_key, value) => {
      if (typeof value === 'bigint') return value.toString()
      return value
    }))

    return res.status(200).json({ ok: true, result: safe })
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Erro ao conectar ao banco', error: String(error.message || error) })
  } finally {
  
  }
}
