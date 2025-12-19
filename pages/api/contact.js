import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const contactSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().trim().email('Email inválido'),
  message: z.string().trim().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { name, email, message } = contactSchema.parse(req.body)

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    })

    return res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      id: saved.id,
      createdAt: saved.createdAt.toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: error.errors,
      })
    }
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}


