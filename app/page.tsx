'use client'

import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Chargement...</p>
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur CVPro IA</h1>
      {session ? (
        <p>Bienvenue, {session.user?.name}!</p>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
      )}
    </main>
  )
}