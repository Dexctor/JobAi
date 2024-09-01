import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/prisma/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10)

    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    // Retourner une réponse de succès
    return NextResponse.json(
      { message: 'Utilisateur créé avec succès', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l'inscription' },
      { status: 500 }
    )
  }
}